import fetchImdbGraphql from 'src/utils/imdbGraphql';
import { isSaneError } from 'src/utils/axiosInstance';
import { AppError } from 'src/utils/helpers';
import titleReviewsQuery from 'src/utils/fetchers/titleReviewsQuery';

const TITLE_ID_REGEX = /^tt\d+$/;

type RawReviewNode = {
  id: string;
  summary?: { originalText: string };
  authorRating?: number;
  author: { userId: string; username: { text: string } };
  submissionDate: string;
  spoiler: boolean;
  helpfulness: { upVotes: number; downVotes: number };
  text?: { originalText?: { plaidHtml: string } };
};

const reviews = async (titleId: string, queryStr = '') => {
  if (!TITLE_ID_REGEX.test(titleId)) throw new AppError('not found', 404);

  try {
    const data = await fetchImdbGraphql(titleReviewsQuery(titleId, queryStr));
    const title = data?.title;
    if (!title) throw new AppError('not found', 404);

    const meta = {
      title: title.titleText.text,
      year: title.releaseYear?.year ?? null,
      image: title.primaryImage?.url ?? null,
      numReviews: title.ratingsSummary.voteCount,
      titleId,
    };

    const edges: Array<{ node: RawReviewNode }> = title.reviews.edges;
    const list = edges.map(({ node }) => ({
      summary: node.summary?.originalText ?? null,
      reviewId: node.id,
      rating: node.authorRating ?? null,
      by: {
        name: node.author.username.text,
        link: `/user/${node.author.userId}`,
      },
      date: node.submissionDate,
      isSpoiler: node.spoiler,
      reviewHtml: node.text?.originalText?.plaidHtml ?? '',
      responses: {
        upVotes: node.helpfulness.upVotes,
        downVotes: node.helpfulness.downVotes,
      },
    }));

    return { meta, list };
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (isSaneError(err) && err.response?.status === 404) throw new AppError('not found', 404, err);
    throw new AppError('something went wrong', 500, err);
  }
};

export default reviews;