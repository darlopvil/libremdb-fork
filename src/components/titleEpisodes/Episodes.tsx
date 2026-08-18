import Link from 'next/link';
import Image from 'next/future/image';
import { modifyIMDbImg, formatTime, formatNumber } from 'src/utils/helpers';
import TitleEpisodes from 'src/interfaces/shared/titleEpisodes';
import styles from 'src/styles/modules/components/titleEpisodes/episodes.module.scss';

type Props = {
    list: TitleEpisodes['list'];
    className?: string;
};

const Episodes = ({ list, className }: Props) => {
    if (!list.length)
        return (
            <div className={`${className} ${styles.noResults}`}>
                <p>No episodes found for the selected filters.</p>
            </div>
        );

    return (
        <div className={`${className} ${styles.episodes}`}>
            {list.map(episode => (
                <article className={styles.episode} key={episode.id}>
                    <div className={styles.imgContainer}>
                        {episode.image && (
                            <Image
                                src={modifyIMDbImg(episode.image, 400)}
                                alt=''
                                fill
                                sizes='200px'
                                className={styles.img}
                            />
                        )}
                    </div>

                    <div className={styles.info}>
                        <h2 className={`heading ${styles.heading}`}>
                            <Link href={episode.url}>
                                {`${episode.seasonNumber && episode.episodeNumber
                                        ? `S${episode.seasonNumber}.E${episode.episodeNumber} · `
                                        : ''
                                    }${episode.title}`}
                            </Link>
                        </h2>

                        <p className={styles.meta}>
                            {episode.date && <span>{episode.date}</span>}
                            {episode.runtime && <span>{formatTime(episode.runtime)}</span>}
                            {episode.rating && (
                                <span className={styles.rating}>
                                    ★ {episode.rating}
                                    {episode.numVotes ? ` (${formatNumber(episode.numVotes)})` : ''}
                                </span>
                            )}
                        </p>

                        {episode.description && <p className={styles.plot}>{episode.description}</p>}
                    </div>
                </article>
            ))}
        </div>
    );
};

export default Episodes;