import fetchImdbGraphql from 'src/utils/imdbGraphql';
import { isSaneError } from 'src/utils/axiosInstance';
import { AppError } from 'src/utils/helpers';
import titleTriviaQuery from 'src/utils/fetchers/titleTriviaQuery';

const TITLE_ID_REGEX = /^tt\d+$/;

type RawTriviaEdge = { node: { displayableArticle: { body: { plaidHtml: string } } } };
type RawTriviaCategory = {
  category: { id: string; text: string };
  trivia: { total: number; edges: RawTriviaEdge[] };
  spoilerTrivia: { total: number; edges: RawTriviaEdge[] };
};

const trivia = async (titleId: string) => {
  if (!TITLE_ID_REGEX.test(titleId)) throw new AppError('not found', 404);

  try {
    const data = await fetchImdbGraphql(titleTriviaQuery(titleId));
    const title = data?.title;
    if (!title) throw new AppError('not found', 404);

    const meta = {
      title: title.titleText.text,
      year: title.releaseYear?.year ? `(${title.releaseYear.year})` : '',
      image: title.primaryImage?.url ?? null,
      titleId,
    };

    const categories: RawTriviaCategory[] = title.triviaCategories ?? [];
    const items: Array<{ html: string; category: string; isSpoiler: boolean }> = [];

    categories.forEach(cat => {
      cat.trivia.edges.forEach(edge =>
        items.push({
          html: edge.node.displayableArticle.body.plaidHtml,
          category: cat.category.text,
          isSpoiler: false,
        })
      );
      cat.spoilerTrivia.edges.forEach(edge =>
        items.push({
          html: edge.node.displayableArticle.body.plaidHtml,
          category: cat.category.text,
          isSpoiler: true,
        })
      );
    });

    return {
      meta,
      total: title.subNavTrivia?.total ?? items.length,
      items,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (isSaneError(err) && err.response?.status === 404) throw new AppError('not found', 404, err);
    throw new AppError('something went wrong', 500, err);
  }
};

export default trivia;