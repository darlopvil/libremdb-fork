import RawList from 'src/interfaces/misc/rawList';
import fetchImdbGraphql from 'src/utils/imdbGraphql';
import cleanList from 'src/utils/cleaners/list';
import { isSaneError } from 'src/utils/axiosInstance';
import { AppError } from 'src/utils/helpers';
import { listMetaQuery, listItemsQuery } from 'src/utils/fetchers/listQuery';

// ls seguido de dígitos. listId viene de la URL: se sanea antes de
// interpolarlo en la query para evitar inyección GraphQL.
const LIST_ID_REGEX = /^ls\d+$/;
const PAGE_SIZE = 25;

const list = async (listId: string, pageNum = '1') => {
  if (!LIST_ID_REGEX.test(listId)) throw new AppError('not found', 404);

  const page = Number.parseInt(pageNum, 10) || 1;

  try {
    // 1. metadatos + tipo de lista (IMDb rechaza la query si se pide el
    //    buscador de un tipo que no corresponde, así que hay que saberlo antes)
    const metaData = await fetchImdbGraphql(listMetaQuery(listId));
    const listMeta = metaData?.list;
    if (!listMeta) throw new AppError('not found', 404);

    // 2. items del tipo correspondiente
    const itemsData = await fetchImdbGraphql(
      listItemsQuery(listId, listMeta.listType.id, page)
    );

    const rawData = {
      props: {
        pageProps: {
          mainColumnData: { list: { ...listMeta, ...itemsData?.list } },
          // la API GraphQL no expone el contador de visitas de la lista
          aboveTheFoldData: { pageViews: { totalPageViews: 0 } },
          totalItems: listMeta.items.total,
          initialPageNumber: page,
        },
      },
    } as unknown as RawList;

    return cleanList(rawData);
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (isSaneError(err) && err.response?.status === 404) throw new AppError('not found', 404, err);
    throw new AppError('something went wrong', 500, err);
  }
};

export default list;