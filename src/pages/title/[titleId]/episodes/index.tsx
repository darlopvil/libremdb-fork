import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Meta from 'src/components/meta/Meta';
import Layout from 'src/components/layout';
import ErrorInfo from 'src/components/error/ErrorInfo';
import { Episodes, Filters, TitleCard } from 'src/components/titleEpisodes';
import { AppError } from 'src/interfaces/shared/error';
import getOrSetApiCache from 'src/utils/getOrSetApiCache';
import titleEpisodes from 'src/utils/fetchers/titleEpisodes';
import { cleanQueryStr, getErrorProperties, getProxiedIMDbImgUrl } from 'src/utils/helpers';
import { titleEpisodesKey } from 'src/utils/constants/keys';
import { keys as titleEpisodesFilterKeys } from 'src/utils/constants/titleEpisodesFilters';
import TitleEpisodes from 'src/interfaces/shared/titleEpisodes';
import styles from 'src/styles/modules/pages/titleEpisodes/titleEpisodes.module.scss';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const EpisodesPage = ({ data, error, originalPath }: Props) => {
  if (error) return <ErrorInfo {...error} originalPath={originalPath} />;

  return (
    <>
      <Meta
        title={`${data.meta.title} - Episodes`}
        description={`Episodes of ${data.meta.title}`}
        imgUrl={data.meta?.image ? getProxiedIMDbImgUrl(data.meta.image) : undefined}
      />
      <Layout className={styles.container} originalPath={originalPath}>
        <TitleCard meta={data.meta} className={styles.card} />
        <Episodes list={data.list ?? []} className={styles.results} />
        <Filters
          titleId={data.meta.titleId}
          seasons={data.seasons ?? []}
          years={data.years ?? []}
          className={styles.form}
        />
      </Layout>
    </>
  );
};

type Data = ({ data: TitleEpisodes; error: null } | { error: AppError; data: null }) & {
  originalPath: string;
};
type Params = { titleId: string };

export const getServerSideProps: GetServerSideProps<Data, Params> = async ctx => {
  const titleId = ctx.params!.titleId;
  const originalPath = ctx.resolvedUrl;
  const queryParams = ctx.query as Record<string, string>;
  const queryStr = cleanQueryStr(queryParams, titleEpisodesFilterKeys);

  try {
    const data = await getOrSetApiCache(
      titleEpisodesKey(titleId, queryStr),
      titleEpisodes,
      titleId,
      queryStr
    );
    return { props: { data, error: null, originalPath } };
  } catch (error) {
    const { message, statusCode } = getErrorProperties(error);
    ctx.res.statusCode = statusCode;
    ctx.res.statusMessage = message;
    return { props: { error: { message, statusCode }, data: null, originalPath } };
  }
};

export default EpisodesPage;