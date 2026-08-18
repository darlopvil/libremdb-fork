import { formatNumber } from 'src/utils/helpers';
import { CardResult } from 'src/components/card';
import TitleEpisodes from 'src/interfaces/shared/titleEpisodes';

type Props = {
  meta: TitleEpisodes['meta'];
  className?: string;
};

const Card = ({ meta, className }: Props) => {
  const years = meta.endYear ? `${meta.year}–${meta.endYear}` : meta.year ?? '';

  return (
    <CardResult
      as='div'
      showImage
      name={`${meta.title} ${years}`}
      link={`/title/${meta.titleId}`}
      image={meta.image ?? undefined}
      className={className}
    >
      <h1 className='heading heading__primary'>Episodes</h1>
      <p>
        {formatNumber(meta.totalEpisodes)} episodes
        {meta.isOngoing ? ' · ongoing' : ''}
      </p>
    </CardResult>
  );
};

export default Card;