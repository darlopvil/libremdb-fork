import { isSaneError } from 'src/utils/axiosInstance';
import fetchImdbGraphql from 'src/utils/imdbGraphql';
import findQuery from 'src/utils/fetchers/findQuery';
import cleanFind from 'src/utils/cleaners/find';
import { AppError } from 'src/utils/helpers';

const basicSearch = async (queryStr: string) => {
  const params = new URLSearchParams(queryStr);
  const term = params.get('q')?.trim();
  if (!term) throw new AppError('not found', 404);

  const queryMeta = {
    exact: params.get('exact') === 'true',
    s: params.get('s'),
    ttype: params.get('ttype'),
  };

  try {
    const data = await fetchImdbGraphql(findQuery(term));
    return cleanFind(data, queryMeta);
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (isSaneError(err) && err.response?.status === 404) throw new AppError('not found', 404, err);
    throw new AppError('something went wrong', 500, err);
  }
};

export default basicSearch;
