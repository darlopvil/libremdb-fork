// mapeo de los filtros de la UI (querystring al estilo IMDb) a los
// argumentos que acepta la API GraphQL de IMDb.
const SORT_BY_MAP: Record<string, string> = {
  featured: 'HELPFULNESS_SCORE',
  submission_date: 'SUBMISSION_DATE',
  num_votes: 'TOTAL_VOTES',
  review_volume: 'SUBMITTER_REVIEW_COUNT',
  user_rating: 'USER_RATING',
};

const titleReviewsQuery = (titleId: string, queryStr = '') => {
  const params = new URLSearchParams(queryStr);

  const sortBy = SORT_BY_MAP[params.get('sort') ?? ''] ?? 'HELPFULNESS_SCORE';
  const order = params.get('dir') === 'asc' ? 'ASC' : 'DESC';

  // filtros opcionales: solo se incluyen si el usuario los ha elegido
  const filters: string[] = [];
  const rating = Number(params.get('rating'));
  if (Number.isInteger(rating) && rating >= 1 && rating <= 10) filters.push(`authorRating: ${rating}`);
  // la UI manda directamente el valor del enum (EXCLUDE); se valida contra
  // la lista permitida para no interpolar nada arbitrario en la query
  const spoiler = params.get('spoiler');
  if (spoiler === 'EXCLUDE' || spoiler === 'INCLUDE') filters.push(`spoiler: ${spoiler}`);
  const filterArg = filters.length ? `, filter: { ${filters.join(', ')} }` : '';

  return `
query {
  title(id: "${titleId}") {
    titleText { text }
    releaseYear { year }
    primaryImage { url }
    ratingsSummary { voteCount }
    reviews(first: 25, sort: { by: ${sortBy}, order: ${order} }${filterArg}) {
      total
      edges { node {
        id
        summary { originalText }
        authorRating
        author { userId username { text } }
        submissionDate
        spoiler
        helpfulness { upVotes downVotes }
        text { originalText { plaidHtml } }
      } }
    }
  }
}
`;
};

export default titleReviewsQuery;