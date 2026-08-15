import axios from 'axios';

// Transporte compartido para la API GraphQL interna de IMDb.
// Sin auth; el header x-imdb-client-name identifica al cliente web oficial de IMDb.
const graphqlInstance = axios.create({
  baseURL: 'https://api.graphql.imdb.com/',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'x-imdb-client-name': 'imdb-web-next-localized',
    ...(process.env.AXIOS_LANGUAGE && { 'Accept-Language': process.env.AXIOS_LANGUAGE }),
  },
});

const fetchImdbGraphql = async (query: string) => {
  const res = await graphqlInstance.post('', { query });
  if (res.data?.errors) {
    throw new Error(`IMDb GraphQL error: ${JSON.stringify(res.data.errors)}`);
  }
  return res.data.data;
};

export default fetchImdbGraphql;