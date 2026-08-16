const PAGE_SIZE = 25;

// IMDb rechaza la query completa si se pide el buscador de un tipo que no
// corresponde ("X is not a People list"), así que primero se consulta el tipo
// de lista y luego se lanza la query específica.
export const listMetaQuery = (listId: string) => `
query {
  list(id: "${listId}") {
    id
    name { originalText }
    description { originalText { plainText } }
    author { userId username { text } }
    createdDate
    lastModifiedDate
    listType { id }
    primaryImage { image { url } }
    items(first: 0) { total }
  }
}
`;

const titlesBlock = (jump: number) => `
    titleListItemSearch(first: ${PAGE_SIZE}, jumpToPosition: ${jump}) {
      total
      edges {
        node { description { originalText { plaidHtml } } }
        title {
          id
          titleText { text }
          primaryImage { url }
          releaseYear { year }
          certificate { rating }
          runtime { seconds }
          titleGenres { genres { genre { text } } }
          plot { plotText { plainText } }
          ratingsSummary { aggregateRating voteCount }
          metacritic { metascore { score } }
          principalCreditsV2 { grouping { text } credits { name { nameText { text } } } }
        }
      }
    }
`;

const namesBlock = (jump: number) => `
    nameListItemSearch(first: ${PAGE_SIZE}, jumpToPosition: ${jump}) {
      total
      edges {
        node { description { originalText { plaidHtml } } }
        name {
          id
          nameText { text }
          primaryImage { url }
          professions { profession { text } }
          knownForV2 { credits { title { id titleText { text } } } }
          bio { displayableArticle { body { plaidHtml } } }
        }
      }
    }
`;

const imagesBlock = () => `
    imageItems: items(first: ${PAGE_SIZE}) {
      total
      edges { node {
        description { originalText { plaidHtml } }
        listItem {
          ... on Image {
            id
            url
            caption { plainText }
            names { id nameText { text } }
            titles { id titleText { text } }
          }
        }
      } }
    }
`;

export const listItemsQuery = (listId: string, listType: string, pageNum = 1) => {
  const jump = (pageNum - 1) * PAGE_SIZE + 1;

  let block = '';
  if (listType === 'TITLES') block = titlesBlock(jump);
  else if (listType === 'PEOPLE') block = namesBlock(jump);
  else if (listType === 'IMAGES') block = imagesBlock();

  return `
query {
  list(id: "${listId}") {
    listType { id }
${block}
  }
}
`;
};

export default listItemsQuery;