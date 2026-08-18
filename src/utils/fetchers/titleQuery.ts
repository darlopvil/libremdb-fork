const titleQuery = (titleId: string) => `
query {
  title(id: "${titleId}") {
    id
    isAdult
    titleText { text }
    originalTitleText { text }
    titleType { id text }
    productionStatus { currentProductionStage { id text } }
    certificate { rating }
    releaseYear { year endYear }
    runtime { seconds }
    ratingsSummary { aggregateRating voteCount topRanking { rank } }
    meterRanking { currentRank rankChange { difference changeDirection } }
    genres { genres { id text } }
    interests(first: 20) { edges { node { id primaryText { text } } } }
    plot { plotText { plainText } }
    principalCreditsV2 { grouping { text } credits { name { id nameText { text } } } }
    primaryImage { id url caption { plainText } }
    primaryVideos(first: 5) {
      edges { node {
        id isMature
        thumbnail { url }
        runtime { value }
        description { value }
        playbackURLs { displayName { value } videoMimeType url }
      } }
    }
    engagementStatistics { watchlistStatistics { displayableCount { text } } }
    keywords(first: 10) { total edges { node { text } } }
    metacritic { metascore { score reviewCount } }

    castV2: credits(first: 40, filter: { categories: ["cast"] }) {
      edges { node {
        name { id nameText { text } primaryImage { url } }
        ... on Cast { characters { name } attributes { text } }
      } }
    }
    titleMainImages: images(first: 20) { total edges { node { id url caption { plainText } } } }
    videos { total }
    videoStrip(first: 20) { edges { node { id contentType { displayName { value } } name { value } runtime { value } thumbnail { url } } } }

    wins: awardNominations(first: 0, filter: { wins: WINS_ONLY }) { total }
    nominationsExcludeWins: awardNominations(first: 0, filter: { wins: EXCLUDE_WINS }) { total }
    prestigiousAwardSummary { award { id text event { text } } nominations wins }

      episodes {
      episodes(first: 0) { total }
      seasons { number }
      years { year }
      topRated: episodes(first: 1, sort: { by: RATING, order: DESC }) {
        edges { node { ratingsSummary { aggregateRating } } }
      }
    }

    trivia: trivia(first: 1) { edges { node { text { plaidHtml } } } }
    triviaTotal: trivia(first: 0) { total }
    goofs: goofs(first: 1) { edges { node { text { plaidHtml } } } }
    goofsTotal: goofs(first: 0) { total }
    quotes: quotes(first: 1) { edges { node { lines { characters { character name { id } } stageDirection text } } } }
    quotesTotal: quotes(first: 0) { total }
    crazyCredits: crazyCredits(first: 1) { edges { node { text { plaidHtml } } } }
    alternateVersions: alternateVersions(first: 1) { total edges { node { text { plaidHtml } } } }
    connections: connections(first: 1) { edges { node { category { text } associatedTitle { id releaseYear { year } titleText { text } } } } }
    soundtrack: soundtrack(first: 1) { edges { node { text comments { plaidHtml } } } }

    reviews(first: 0) { total }
    aggregateRatingsBreakdown { histogram { histogramValues { rating voteCount } } }
    reviewSummary { overall { medium { value { plaidHtml } } } themes { label { value } themeId sentiment } }
    featuredReviews(first: 5) { edges { node { id author { userId username { text } } authorRating summary { originalText } text { originalText { plaidHtml } } } } }

    releaseDate { year month day country { id text } }
    countriesDetails: countriesOfOrigin { countries { id text } }
    detailsExternalLinks: externalLinks(first: 50) { total edges { node { label url externalLinkRegion { text } } } }
    spokenLanguages { spokenLanguages { id text } }
    akas(first: 1) { edges { node { text } } }
    filmingLocations(first: 20) { total edges { node { text } } }
    production: companyCredits(first: 20, filter: { categories: ["production"] }) { edges { node { company { id companyText { text } } } } }
    companies: companyCredits(first: 0) { total }

    productionBudget { budget { amount currency } }
    worldwideGross: lifetimeGross(boxOfficeArea: WORLDWIDE) { total { amount currency } }
    lifetimeGross(boxOfficeArea: DOMESTIC) { total { amount currency } }
    openingWeekendGross(boxOfficeArea: DOMESTIC) { gross { total { amount currency } } weekendEndDate }

    technicalSpecifications {
      soundMixes { items { id text } }
      aspectRatios { items { aspectRatio } }
      colorations { items { conceptId text } }
    }

    moreLikeThisTitles(first: 12) {
      edges { node {
        id titleText { text }
        primaryImage { id url }
        titleType { id text }
        certificate { rating }
        releaseYear { year endYear }
        runtime { seconds }
        ratingsSummary { aggregateRating voteCount }
        titleGenres { genres { genre { text } } }
      } }
    }

    faqs(first: 10) { total edges { node { question { plainText } id } } }
  }
}
`;

export default titleQuery;