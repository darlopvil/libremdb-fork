import RawFind from 'src/interfaces/misc/rawFind';
import { resultTypes, resultTitleTypes } from 'src/utils/constants/find';

type QueryMeta = { exact: boolean; s: string | null; ttype: string | null };

const cleanFind = (data: RawFind, queryMeta: QueryMeta) => {
  const cleanData = {
    meta: {
      exact: queryMeta.exact,
      type: resultTypes.types.find(t => t.val === queryMeta.s)?.id ?? null,
      titleType: resultTitleTypes.types.find(t => t.val === queryMeta.ttype)?.id ?? null,
    },
    people: data.nameResults.edges.map(({ node: { entity: p } }) => ({
      id: p.id,
      name: p.nameText.text,
      bio: p.bio?.text?.plainText ? p.bio.text.plainText.slice(0, 150) + '...' : null,
      professions: p.primaryProfessions?.map(pr => pr.category.text) ?? null,
      knownForTitle: p.knownFor?.edges?.[0]?.node.credit.title.titleText.text ?? null,
      knownInYear: p.knownFor?.edges?.[0]?.node.credit.title.releaseYear?.year ?? null,
      ...(p.primaryImage && {
        image: { url: p.primaryImage.url, caption: p.primaryImage.caption?.plainText ?? null },
      }),
    })),
    titles: data.titleResults.edges.map(({ node: { entity: t } }) => ({
      id: t.id,
      name: t.titleText.text,
      type: t.titleType.text,
      plot: t.plot?.plotText?.plainText ?? null,
      releaseYear: t.releaseYear?.year ?? null,
      runtime: t.runtime?.seconds ?? null,
      certificate: t.certificate?.rating ?? null,
      rating: {
        score: t.ratingsSummary?.aggregateRating ?? null,
        voteCount: t.ratingsSummary?.voteCount ?? null,
      },
      ...(t.primaryImage && {
        image: { url: t.primaryImage.url, caption: t.primaryImage.caption?.plainText ?? null },
      }),
    })),
    companies: data.companyResults.edges.map(({ node: { entity: c } }) => ({
      id: c.id,
      name: c.companyText.text,
      type: c.companyTypes?.[0]?.text ?? null,
      country: c.country?.text ?? null,
    })),
    keywords: data.keywordResults.edges.map(({ node: { entity: k } }) => ({
      id: k.id,
      text: k.text.text,
      numTitles: k.titles?.total ?? null,
    })),
  };

  return cleanData;
};

export default cleanFind;
