import { ChangeEvent, FormEventHandler, useState } from 'react';
import { useRouter } from 'next/router';
import { sortBy, direction } from 'src/utils/constants/titleEpisodesFilters';
import styles from 'src/styles/modules/components/titleReviews/form.module.scss';

type Props = {
  className?: string;
  titleId: string;
  seasons: string[];
  years: string[];
};

const Filters = ({ className, titleId, seasons, years }: Props) => {
  const router = useRouter();
  const params = router.query;

  const [formState, setFormState] = useState({
    season: params['season']?.toString() ?? '',
    year: params['year']?.toString() ?? '',
    sortBy: params['sort']?.toString() ?? sortBy.types[0].val,
    direction: params['dir']?.toString() ?? direction.types[0].val,
  });

  const submitHandler: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const urlSearchParams = new URLSearchParams();
    if (formState.season) urlSearchParams.append('season', formState.season);
    if (formState.year) urlSearchParams.append('year', formState.year);
    urlSearchParams.append('sort', formState.sortBy);
    urlSearchParams.append('dir', formState.direction);
    router.push(`/title/${titleId}/episodes?${urlSearchParams.toString()}`);
  };

  const clearHandler = () => {
    setFormState({
      season: '',
      year: '',
      sortBy: sortBy.types[0].val,
      direction: direction.types[0].val,
    });
    router.push(`/title/${titleId}/episodes`);
  };

  return (
    <form onSubmit={submitHandler} className={`${className} ${styles.form}`}>
      <fieldset className={styles.fieldset}>
        <legend className={`heading ${styles.fieldset__heading}`}>Season</legend>
        <p className={styles.radio}>
          <input
            type='radio'
            name='season'
            id='season:all'
            className='visually-hidden'
            checked={formState.season === ''}
            onChange={() => setFormState({ ...formState, season: '' })}
          />
          <label htmlFor='season:all'>All</label>
        </p>
        {seasons.map(s => (
          <p className={styles.radio} key={s}>
            <input
              type='radio'
              name='season'
              id={`season:${s}`}
              className='visually-hidden'
              checked={formState.season === s}
              onChange={() => setFormState({ ...formState, season: s, year: '' })}
            />
            <label htmlFor={`season:${s}`}>{s}</label>
          </p>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={`heading ${styles.fieldset__heading}`}>Sort by</legend>
        {sortBy.types.map(({ name, val }) => (
          <p className={styles.radio} key={val}>
            <input
              type='radio'
              name='sort'
              id={`sort:${val}`}
              className='visually-hidden'
              checked={formState.sortBy === val}
              onChange={() => setFormState({ ...formState, sortBy: val })}
            />
            <label htmlFor={`sort:${val}`}>{name}</label>
          </p>
        ))}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={`heading ${styles.fieldset__heading}`}>Direction</legend>
        {direction.types.map(({ name, val }) => (
          <p className={styles.radio} key={val}>
            <input
              type='radio'
              name='dir'
              id={`dir:${val}`}
              className='visually-hidden'
              checked={formState.direction === val}
              onChange={() => setFormState({ ...formState, direction: val })}
            />
            <label htmlFor={`dir:${val}`}>{name}</label>
          </p>
        ))}
      </fieldset>

      <div className={styles.buttons}>
        <button type='button' className={styles.button} onClick={clearHandler}>
          Clear
        </button>
        <button type='submit' className={styles.button}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default Filters;