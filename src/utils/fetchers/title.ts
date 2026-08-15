import RawTitle from 'src/interfaces/misc/rawTitle';
import { isSaneError } from 'src/utils/axiosInstance';
import fetchImdbGraphql from 'src/utils/imdbGraphql';
import titleQuery from 'src/utils/fetchers/titleQuery';
import cleanTitle from 'src/utils/cleaners/title';
import { AppError } from 'src/utils/helpers';

const title = async (titleId: string) => {
  // saneo: titleId viene de la URL sin validar -> evita inyeccion en la query
  if (!/^tt\d+$/.test(titleId)) throw new AppError('not found', 404);

  try {
    const data = await fetchImdbGraphql(titleQuery(titleId));
    const rawTitle = data?.title;
    // GraphQL devuelve title: null para un id inexistente (con HTTP 200)
    if (!rawTitle) throw new AppError('not found', 404);

    // el cleaner espera la forma del __NEXT_DATA__ de IMDb; le pasamos
    // el mismo objeto Title como aboveTheFoldData y mainColumnData
    const parsedRawData = {
      props: { pageProps: { aboveTheFoldData: rawTitle, mainColumnData: rawTitle } },
    } as unknown as RawTitle;

    return cleanTitle(parsedRawData);
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (isSaneError(err) && err.response?.status === 404) throw new AppError('not found', 404, err);
    throw new AppError('something went wrong', 500, err);
  }
};

export default title;