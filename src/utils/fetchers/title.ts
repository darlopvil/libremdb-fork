import RawTitle from 'src/interfaces/misc/rawTitle';
import { isSaneError } from 'src/utils/axiosInstance';
import fetchImdbGraphql from 'src/utils/imdbGraphql';
import cleanTitle from 'src/utils/cleaners/title';
import { AppError } from 'src/utils/helpers';
import titleQuery from 'src/utils/fetchers/titleQuery';

// tt seguido de dígitos. titleId viene de la URL: lo saneamos antes de
// interpolarlo en la query para evitar inyección GraphQL.
const TITLE_ID_REGEX = /^tt\d+$/;

const title = async (titleId: string) => {
  if (!TITLE_ID_REGEX.test(titleId)) throw new AppError('not found', 404);

  try {
    const data = await fetchImdbGraphql(titleQuery(titleId));
    const titleData = data?.title;
    if (!titleData) throw new AppError('not found', 404);

    // el cleaner espera la forma del __NEXT_DATA__: el mismo Title como main y misc
    const rawData = {
      props: { pageProps: { aboveTheFoldData: titleData, mainColumnData: titleData } },
    } as RawTitle;

    return cleanTitle(rawData);
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (isSaneError(err) && err.response?.status === 404) throw new AppError('not found', 404, err);
    throw new AppError('something went wrong', 500, err);
  }
};

export default title;