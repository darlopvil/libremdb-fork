const titleTriviaQuery = (titleId: string) => `
query {
  title(id: "${titleId}") {
    id
    titleText { text }
    releaseYear { year }
    primaryImage { url }
    subNavTrivia: trivia(first: 0) { total }
    triviaCategories {
      category { id text }
      trivia(first: 250, filter: { spoilers: EXCLUDE_SPOILERS }) {
        total
        edges { node { displayableArticle { body { plaidHtml } } } }
      }
      spoilerTrivia: trivia(first: 250, filter: { spoilers: SPOILERS_ONLY }) {
        total
        edges { node { displayableArticle { body { plaidHtml } } } }
      }
    }
  }
}
`;

export default titleTriviaQuery;