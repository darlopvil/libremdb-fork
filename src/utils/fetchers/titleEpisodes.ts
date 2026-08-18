import fetchImdbGraphql from 'src/utils/imdbGraphql';
import { isSaneError } from 'src/utils/axiosInstance';
import { AppError } from 'src/utils/helpers';
import titleEpisodesQuery from 'src/utils/fetchers/titleEpisodesQuery';

const TITLE_ID_REGEX = /^tt\d+$/;

type RawEpisodeNode = {
  id: string;
  titleText: { text: string };
  plot?: { plotText?: { plainText: string } };
  primaryImage?: { url: string; caption?: { plainText: string } };
  ratingsSummary: { aggregateRating?: number; voteCount: number };
  releaseDate?: { day?: number; month?: number; year?: number };
  runtime?: { seconds: number };
  series?: { episodeNumber?: { episodeNumber?: number; seasonNumber?: number } };
};

const episodes = async (titleId: string, queryStr = '') => {
  if (!TITLE_ID_REGEX.test(titleId)) throw new AppError('not found', 404);

  try {
    const data = await fetchImdbGraphql(titleEpisodesQuery(titleId, queryStr));
    const title = data?.title;
    if (!title) throw new AppError('not found', 404);
    if (!title.episodes) throw new AppError('not found', 404); // no es una serie

    const meta = {
      title: title.titleText.text,
      titleId,
      image: title.primaryImage?.url ?? null,
      year: title.releaseYear?.year ?? null,
      endYear: title.releaseYear?.endYear ?? null,
      type: title.titleType?.text ?? null,
      isOngoing: title.episodes.isOngoing ?? null,
      totalEpisodes: title.episodes.totalEpisodes?.total ?? 0,
    };

    const seasons: string[] = title.episodes.displayableSeasons.edges.map(
      (e: { node: { season: string } }) => e.node.season
    );
    const years: string[] = title.episodes.displayableYears.edges.map(
      (e: { node: { year: string } }) => e.node.year
    );

    const edges: Array<{ node: RawEpisodeNode }> = title.episodes.episodes.edges;
    const list = edges.map(({ node }) => ({
      id: node.id,
      title: node.titleText.text,
      url: `/title/${node.id}`,
      description: node.plot?.plotText?.plainText ?? null,
      image: node.primaryImage?.url ?? null,
      rating: node.ratingsSummary.aggregateRating ?? null,
      numVotes: node.ratingsSummary.voteCount ?? null,
      runtime: node.runtime?.seconds ?? null,
      episodeNumber: node.series?.episodeNumber?.episodeNumber ?? null,
      seasonNumber: node.series?.episodeNumber?.seasonNumber ?? null,
      date: node.releaseDate
        ? [node.releaseDate.year, node.releaseDate.month, node.releaseDate.day]
            .filter(Boolean)
            .join('-')
        : null,
    }));

    return { meta, seasons, years, total: title.episodes.episodes.total, list };
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (isSaneError(err) && err.response?.status === 404) throw new AppError('not found', 404, err);
    throw new AppError('something went wrong', 500, err);
  }
};

export default episodes;