import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Meta from 'src/components/meta/Meta';
import Layout from 'src/components/layout';
import ErrorInfo from 'src/components/error/ErrorInfo';
import { CardResult } from 'src/components/card';
import { AppError } from 'src/interfaces/shared/error';
import getOrSetApiCache from 'src/utils/getOrSetApiCache';
import titleTrivia from 'src/utils/fetchers/titleTrivia';
import { getErrorProperties, getProxiedIMDbImgUrl, formatNumber } from 'src/utils/helpers';
import { titleTriviaKey } from 'src/utils/constants/keys';
import Trivia from 'src/interfaces/shared/trivia';
import styles from 'src/styles/modules/pages/title/trivia.module.scss';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const TriviaPage = ({ data, error, originalPath }: Props) => {
  if (error) return <ErrorInfo {...error} originalPath={originalPath} />;

  return (
    <>
      <Meta
        title={`${data.meta.title} - Trivia`}
        description={`Trivia for ${data.meta.title}`}
        imgUrl={data.meta?.image ? getProxiedIMDbImgUrl(data.meta.image) : undefined}
      />
      <Layout className={styles.container} originalPath={originalPath}>
        <CardResult
          as='div'
          showImage
          name={`${data.meta.title} ${data.meta.year}`}
          link={`/title/${data.meta.titleId}`}
          image={data.meta.image ?? undefined}
          className={styles.card}
        >
          <h1 className='heading heading__primary'>Trivia</h1>
          <p>{formatNumber(data.total)} items</p>
        </CardResult>

        <div className={styles.results}>
          {!data.items.length && (
            <p className={styles.noResults}>No trivia found for this title.</p>
          )}
          {data.items.map((item, i) => (
            <div className={styles.item} key={i}>
              {item.category !== 'Uncategorized' && (
                <span className={styles.category}>{item.category}</span>
              )}
              {item.isSpoiler ? (
                <details className={styles.spoiler}>
                  <summary>Spoiler — click to reveal</summary>
                  <div dangerouslySetInnerHTML={{ __html: item.html }} />
                </details>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: item.html }} />
              )}
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
};

type Data = ({ data: Trivia; error: null } | { error: AppError; data: null }) & {
  originalPath: string;
};
type Params = { titleId: string };

export const getServerSideProps: GetServerSideProps<Data, Params> = async ctx => {
  const titleId = ctx.params!.titleId;
  const originalPath = ctx.resolvedUrl;

  try {
    const data = await getOrSetApiCache(titleTriviaKey(titleId), titleTrivia, titleId);
    return { props: { data, error: null, originalPath } };
  } catch (error) {
    const { message, statusCode } = getErrorProperties(error);
    ctx.res.statusCode = statusCode;
    ctx.res.statusMessage = message;
    return { props: { error: { message, statusCode }, data: null, originalPath } };
  }
};

export default TriviaPage;