// mapeo de los filtros de la UI a los argumentos de la API GraphQL de IMDb
const SORT_BY_MAP: Record<string, string> = {
  episode: 'EPISODE_THEN_RELEASE',
  rating: 'RATING',
  release: 'RELEASE_DATE',
};

const titleEpisodesQuery = (titleId: string, queryStr = '') => {
  const params = new URLSearchParams(queryStr);

  // temporada: solo dígitos, para no interpolar nada arbitrario
  const rawSeason = params.get('season') ?? '';
  const season = /^\d+$/.test(rawSeason) ? rawSeason : null;

  const rawYear = params.get('year') ?? '';
  const year = /^\d{4}$/.test(rawYear) ? rawYear : null;

  const sortBy = SORT_BY_MAP[params.get('sort') ?? ''] ?? 'EPISODE_THEN_RELEASE';
  const order = params.get('dir') === 'desc' ? 'DESC' : 'ASC';

  // si no se pide temporada ni año, se listan los episodios de la primera temporada
  const filters: string[] = [];
  if (season) filters.push(`includeSeasons: ["${season}"]`);
  if (year)
    filters.push(
      `releasedOnOrAfter: { year: ${year}, month: 1, day: 1 }, releasedOnOrBefore: { year: ${year}, month: 12, day: 31 }`
    );
  const filterArg = filters.length ? `, filter: { ${filters.join(', ')} }` : '';

  return `
query {
  title(id: "${titleId}") {
    id
    titleText { text }
    releaseYear { year endYear }
    primaryImage { url caption { plainText } }
    titleType { id text canHaveEpisodes }
    episodes {
      isOngoing
      displayableSeasons(first: 100) { edges { node { season } } }
      displayableYears(first: 100) { edges { node { year } } }
      totalEpisodes: episodes(first: 0) { total }
      episodes(first: 250${filterArg}, sort: { by: ${sortBy}, order: ${order} }) {
        total
        edges { node {
          id
          titleText { text }
          plot { plotText { plainText } }
          primaryImage { url caption { plainText } }
          ratingsSummary { aggregateRating voteCount }
          releaseDate { day month year }
          runtime { seconds }
          series { episodeNumber { episodeNumber seasonNumber } }
        } }
      }
    }
  }
}
`;
};

export default titleEpisodesQuery;