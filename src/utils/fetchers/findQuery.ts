const findQuery = (term: string) => `
query {
  titleResults: mainSearch(first: 20, options: { searchTerm: ${JSON.stringify(term)}, type: TITLE, includeAdult: true }) {
    edges { node { entity { ... on Title {
      id
      titleText { text }
      originalTitleText { text }
      titleType { id text canHaveEpisodes }
      releaseYear { year endYear }
      runtime { seconds }
      certificate { rating }
      plot { plotText { plainText } }
      ratingsSummary { aggregateRating voteCount }
      primaryImage { url caption { plainText } }
    } } } }
  }
  nameResults: mainSearch(first: 20, options: { searchTerm: ${JSON.stringify(term)}, type: NAME, includeAdult: true }) {
    edges { node { entity { ... on Name {
      id
      nameText { text }
      primaryProfessions(limit: 3) { category { text } }
      knownFor(first: 1) { edges { node { credit { title { titleText { text } releaseYear { year endYear } } } } } }
      primaryImage { url caption { plainText } }
      bio { text { plainText } }
    } } } }
  }
  companyResults: mainSearch(first: 10, options: { searchTerm: ${JSON.stringify(term)}, type: COMPANY, includeAdult: true }) {
    edges { node { entity { ... on Company {
      id
      companyText { text }
      companyTypes { text }
      country { text }
    } } } }
  }
  keywordResults: mainSearch(first: 10, options: { searchTerm: ${JSON.stringify(term)}, type: KEYWORD, includeAdult: true }) {
    edges { node { entity { ... on Keyword {
      id
      text { text }
      titles(first: 9999) { total }
    } } } }
  }
}
`;

export default findQuery;
