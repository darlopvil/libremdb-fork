import Link from 'next/link';
import Meta from 'src/components/meta/Meta';
import Layout from 'src/components/layout';
import styles from 'src/styles/modules/pages/about/about.module.scss';

const About = () => {
  return (
    <>
      <Meta
        title='About'
        description='libremdb is a free & open source IMDb front-end. It allows you to see information about movies, tv shows, video games without any ads or tracking.'
      />
      <Layout full className={styles.about}>
        <section id='features' className={styles.features}>
          <h2
            className={`heading heading__secondary ${styles.features__heading}`}
          >
            Some features
          </h2>
          <ul className={styles.features__list}>
            <li className={styles.feature}>
              <svg
                aria-hidden='true'
                focusable='false'
                role='img'
                className={styles.feature__icon}
              >
                <use href='/svg/sprite.svg#icon-eye-slash'></use>
              </svg>
              <h3
                className={`heading heading__tertiary ${styles.feature__heading}`}
              >
                No ads or tracking
              </h3>
              <p className={styles.feature__text}>
                Browse any movie info without being tracked or bombarded by
                annoying ads.
              </p>
            </li>
            <li className={styles.feature}>
              <svg
                aria-hidden='true'
                focusable='false'
                role='img'
                className={styles.feature__icon}
              >
                <use href='/svg/sprite.svg#icon-palette'></use>
              </svg>
              <h3
                className={`heading heading__tertiary ${styles.feature__heading}`}
              >
                Modern interface
              </h3>
              <p className={styles.feature__text}>
                Modern interface with curated colors supporting both dark and
                light themes.
              </p>
            </li>
            <li className={styles.feature}>
              <svg
                aria-hidden='true'
                focusable='false'
                role='img'
                className={styles.feature__icon}
              >
                <use href='/svg/sprite.svg#icon-responsive'></use>
              </svg>
              <h3
                className={`heading heading__tertiary ${styles.feature__heading}`}
              >
                Responsive design
              </h3>
              <p className={styles.feature__text}>
                Be it your small mobile or big computer screen, it's fully
                responsive.
              </p>
            </li>
          </ul>
        </section>
                <section id='fork' className={styles.faqs}>
          <h2 className={`heading heading__secondary ${styles.faqs__heading}`}>
            Sobre este fork
          </h2>
          <p className={styles.fork__intro}>
            Esta instancia ejecuta{' '}
            <a
              href='https://github.com/darlopvil/libremdb-fork'
              className='link'
              target='_blank'
              rel='noreferrer'
            >
              darlopvil/libremdb-fork
            </a>
            , una versión modificada de{' '}
            <a
              href='https://github.com/zyachel/libremdb'
              className='link'
              target='_blank'
              rel='noreferrer'
            >
              libremdb
            </a>{' '}
            de Ashish (zyachel). El fork nació para mantener el proyecto en
            funcionamiento después de que IMDb dejara de servir el bloque{' '}
            <code>__NEXT_DATA__</code> del que dependían todos los fetchers, lo
            que devolvía un error 500 en toda la aplicación.
          </p>
          <ul className={styles.faqs__list}>
            <li className={styles.faq}>
              <details>
                <summary className={styles.faq__summary}>
                  Migración a la API GraphQL de IMDb
                </summary>
                <div className={styles.faq__description}>
                  Los cinco fetchers (título, persona, búsqueda, reseñas y
                  listas) se reescribieron para consumir la API GraphQL interna
                  de IMDb en lugar de raspar el HTML. Cada identificador recibido
                  por URL se valida antes de interpolarlo en la consulta para
                  evitar inyección.
                </div>
              </details>
            </li>
            <li className={styles.faq}>
              <details>
                <summary className={styles.faq__summary}>
                  Reseñas sin necesidad de iniciar sesión
                </summary>
                <div className={styles.faq__description}>
                  La API GraphQL devuelve las reseñas de usuario sin sesión
                  iniciada, lo que resuelve la limitación por la que IMDb había
                  empezado a exigir cuenta para verlas.
                </div>
              </details>
            </li>
            <li className={styles.faq}>
              <details>
                <summary className={styles.faq__summary}>
                  Páginas nuevas: episodios y curiosidades
                </summary>
                <div className={styles.faq__description}>
                  Se añadieron una página de episodios para series (con filtros
                  por temporada, orden y dirección) y una página de curiosidades
                  (trivia) con las entradas marcadas como spoiler ocultas tras un
                  desplegable.
                </div>
              </details>
            </li>
            <li className={styles.faq}>
              <details>
                <summary className={styles.faq__summary}>
                  Ficha de título ampliada
                </summary>
                <div className={styles.faq__description}>
                  Se muestran las fechas de estreno y los títulos alternativos
                  por país (destacando el país configurado), las preguntas
                  frecuentes con su respuesta, y el episodio mejor valorado en la
                  ficha de las series.
                </div>
              </details>
            </li>
            <li className={styles.faq}>
              <details>
                <summary className={styles.faq__summary}>
                  Datos localizados
                </summary>
                <div className={styles.faq__description}>
                  Los datos de IMDb (título, sinopsis, géneros, intereses,
                  palabras clave, países, idiomas y calificación por edades) se
                  sirven en el idioma y país configurados en la instancia. La
                  interfaz permanece en inglés.
                </div>
              </details>
            </li>
            <li className={styles.faq}>
              <details>
                <summary className={styles.faq__summary}>
                  Imágenes en color y con privacidad
                </summary>
                <div className={styles.faq__description}>
                  Se corrigió un fallo por el que las imágenes se mostraban en
                  blanco y negro (una versión antigua de la librería sharp
                  procesaba mal el color en CPUs sin AVX2). Además, toda la media
                  se sirve a través del proxy interno, de modo que el navegador
                  nunca contacta directamente con IMDb.
                </div>
              </details>
            </li>
          </ul>
        </section>
        <section id='faq' className={styles.faqs}>
          <h2 className={`heading heading__secondary ${styles.faqs__heading}`}>
            Questions you may have
          </h2>
          <div className={styles.faqs__list}>
            <details className={styles.faq}>
              <summary className={styles.faq__summary}>
                How do I use this?
              </summary>
              <p className={styles.faq__description}>
                Replace `imdb.com` in any IMDb URL with any of the instances.
                For example: `
                <a
                  href='https://imdb.com/title/tt1049413'
                  className='link'
                  target='_blank'
                  rel='noreferrer'
                >
                  imdb.com/title/tt1049413
                </a>
                ` to `
                <Link href='/title/tt1049413'>
                  <a className='link'>
                    {process.env.NEXT_PUBLIC_URL || ''}/title/tt1049413
                  </a>
                </Link>
                ` . To avoid changing the URLs manually, you can use extensions
                like{' '}
                <a
                  href='https://github.com/libredirect/libredirect/'
                  className='link'
                >
                  LibRedirect
                </a>
                .
              </p>
            </details>
            <details className={styles.faq}>
              <summary className={styles.faq__summary}>Why is it slow?</summary>
              <p className={styles.faq__description}>
                Whenever you request info about a movie/show on libremdb, 4
                trips are made(2 between your browser and libremdb's server, and
                2 between libremdb's server and IMDb's server) instead of the
                usual 2 trips when you visit a website. For this reason there's
                a noticable delay. This is a bit of inconvenience you'll have to
                face should you wish to use this website.
              </p>
            </details>
            <details className={styles.faq}>
              <summary className={styles.faq__summary}>
                It doesn't have all routes.
              </summary>
              <p className={styles.faq__description}>
                I'll implement more with time :)
              </p>
            </details>
            <details className={styles.faq}>
              <summary className={styles.faq__summary}>
                Is content served from third-parties, like Amazon?
              </summary>
              <p className={styles.faq__description}>
                Nope, libremdb proxies all image and video requests through the
                instance to avoid exposing your IP address, browser information
                and other personally identifiable metadata (
                <a
                  href='https://github.com/httpjamesm'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='link'
                >
                  Contributor
                </a>
                ).
              </p>
            </details>
            <details className={styles.faq}>
              <summary className={styles.faq__summary}>
                Why not just use IMDb?
              </summary>
              <p className={styles.faq__description}>
                Refer to the{' '}
                <a className='link' href='#features'>
                  features section
                </a>{' '}
                above.
              </p>
            </details>
            <details className={styles.faq}>
              <summary className={styles.faq__summary}>
                Why didn't you use other databases like TMDB or OMDb?
              </summary>
              <p className={styles.faq__description}>
                IMDb simply has superior dataset compared to all other
                alternatives. With that being said, I'd encourage you to check
                out those alternatives too.
              </p>
            </details>
            <details className={styles.faq}>
              <summary className={styles.faq__summary}>
                Your website name is quite, ehm, lame.
              </summary>
              <p className={styles.faq__description}>
                Let's just say I'm not very good at naming things.
              </p>
            </details>
            <details className={styles.faq}>
              <summary className={styles.faq__summary}>
                I have some ideas/features/suggestions.
              </summary>
              <p className={styles.faq__description}>
                That's great! I've a couple of{' '}
                <Link href='/contact'>
                  <a className='link'>contact methods</a>
                </Link>
                . Send your beautiful suggestions(or complaints), or just drop a
                hi.
              </p>
            </details>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
