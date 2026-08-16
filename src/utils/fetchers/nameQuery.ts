const nameQuery = (nameId: string) => `
query {
  name(id: "${nameId}") {
    id
    nameText { text }
    disambiguator { text }
    primaryImage { id url caption { plainText } }
    primaryProfessions { category { text } }
    bio { text { plaidHtml plainText } }
    birthDate { displayableProperty { value { plainText } } }
    deathStatus
    deathDate { displayableProperty { value { plainText } } }
    meterRanking { currentRank rankChange { difference changeDirection } }
    primaryVideos(first: 5) {
      edges { node {
        id isMature
        thumbnail { url }
        runtime { value }
        description { value }
        playbackURLs { displayName { value } videoMimeType url }
      } }
    }

    knownForV2 {
      credits {
        title {
          id titleText { text }
          primaryImage { id url caption { plainText } }
          titleType { id text }
          certificate { rating }
          releaseYear { year endYear }
          runtime { seconds }
          ratingsSummary { aggregateRating voteCount }
          titleGenres { genres { genre { text } } }
        }
        creditedRoles(first: 5) { edges { node { category { text } characters(first: 10) { edges { node { name } } } attributes { text } } } }
      }
    }

    images(first: 20) { total edges { node { id url caption { plainText } } } }
    videos(first: 20) { total edges { node { id contentType { displayName { value } } name { value } runtime { value } thumbnail { url } } } }

    wins: awardNominations(first: 0, filter: { wins: WINS_ONLY }) { total }
    nominationsExcludeWins: awardNominations(first: 0, filter: { wins: EXCLUDE_WINS }) { total }
    prestigiousAwardSummary { award { id text event { id } } nominations wins }

    creditSummary { totalCredits { total } genres { total genre { text } } }
    creditCategories {
      category { text }
      credits(first: 50) {
        total
        edges { node {
          title {
            id titleText { text }
            primaryImage { id url caption { plainText } }
            titleType { id text }
            certificate { rating }
            releaseYear { year endYear }
            runtime { seconds }
            ratingsSummary { aggregateRating voteCount }
            titleGenres { genres { genre { text } } }
            productionStatus { currentProductionStage { text } }
          }
          ... on Cast {
            episodeCredits(first: 0) { total yearRange { year endYear } }
            characters { name }
            attributes { text }
          }
          ... on Crew {
            episodeCredits(first: 0) { total yearRange { year endYear } }
            jobs { text }
            attributes { text }
          }
        } }
      }
    }

    personalDetailsExternalLinks: externalLinks(first: 50) { edges { node { label url } } }
    akas(first: 20) { edges { node { displayableProperty { value { plainText } } } } }
    height { displayableProperty { value { plainText } } }
    birthLocation { text }
    deathLocation { displayableProperty { value { plainText } } }
    deathCause { displayableProperty { value { plainText } } }
    personalDetailsSpouses: spouses {
      spouse { asMarkdown { plainText } name { id } }
      timeRange { displayableProperty { value { plaidHtml } } }
      attributes { text }
    }
    children: relations(first: 20, filter: { relationshipTypes: CHILDREN }) {
      edges { node { relationName { displayableProperty { value { plainText } } name { id } } } }
    }
    parents: relations(first: 20, filter: { relationshipTypes: PARENTS }) {
      edges { node { relationName { displayableProperty { value { plainText } } name { id } } } }
    }
    others: relations(first: 20, filter: { relationshipTypes: OTHERS }) {
      edges { node { relationshipType { text } relationName { name { id } displayableProperty { value { plainText } } } } }
    }
    otherWorks(first: 20) { edges { node { category { text } text { plaidHtml } } } }

    publicityListings(first: 0) { total }
    nameFilmBiography: publicityListings(first: 0, filter: { categories: ["nameFilmBiography"] }) { total }
    namePrintBiography: publicityListings(first: 0, filter: { categories: ["namePrintBiography"] }) { total }
    publicityInterview: publicityListings(first: 0, filter: { categories: ["interview"] }) { total }
    publicityArticle: publicityListings(first: 0, filter: { categories: ["article"] }) { total }
    publicityMagazineCover: publicityListings(first: 0, filter: { categories: ["magazineCover"] }) { total }
    publicityPictorial: publicityListings(first: 0, filter: { categories: ["pictorial"] }) { total }

    trivia(first: 1) { edges { node { displayableArticle { body { plaidHtml } } } } }
    triviaTotal: trivia(first: 0) { total }
    trademarks(first: 1) { edges { node { displayableArticle { body { plaidHtml } } } } }
    trademarksTotal: trademarks(first: 0) { total }
    quotes(first: 1) { edges { node { displayableArticle { body { plaidHtml } } } } }
    quotesTotal: quotes(first: 0) { total }
    nickNames { displayableProperty { value { plainText } } }
    titleSalaries(first: 1) {
      edges { node {
        displayableProperty { value { plainText } }
        title { id releaseYear { year } titleText { text } }
      } }
    }
    titleSalariesTotal: titleSalaries(first: 0) { total }
  }
}
`;

export default nameQuery;
