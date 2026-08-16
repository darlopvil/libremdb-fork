import RawName from 'src/interfaces/misc/rawName';
import { isSaneError } from 'src/utils/axiosInstance';
import fetchImdbGraphql from 'src/utils/imdbGraphql';
import cleanName from 'src/utils/cleaners/name';
import { AppError } from 'src/utils/helpers';
import nameQuery from 'src/utils/fetchers/nameQuery';

// nm seguido de dígitos. nameId viene de la URL: se sanea antes de
// interpolarlo en la query para evitar inyección GraphQL.
const NAME_ID_REGEX = /^nm\d+$/;

const name = async (nameId: string) => {
  if (!NAME_ID_REGEX.test(nameId)) throw new AppError('not found', 404);

  try {
    const data = await fetchImdbGraphql(nameQuery(nameId));
    const nameData = data?.name;
    if (!nameData) throw new AppError('not found', 404);

    // el cleaner espera la forma del __NEXT_DATA__: el mismo Name como main y misc
    const rawData = {
      props: { pageProps: { aboveTheFold: nameData, mainColumnData: nameData } },
    } as RawName;

    return cleanName(rawData);
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (isSaneError(err) && err.response?.status === 404) throw new AppError('not found', 404, err);
    throw new AppError('something went wrong', 500, err);
  }
};

export default name;