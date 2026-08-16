import RawList from 'src/interfaces/misc/rawList';
import { formatDate, htmlToText } from 'src/utils/helpers';

const cleanList = (rawList: RawList) => {
  const p = rawList.props.pageProps;
  const d = p.mainColumnData.list;

  const meta = {
    title: d.name?.originalText ?? null,
    description: d.description?.originalText?.plainText || null,
    by: {
      name: d.author.username.text,
      id: d.author.userId,
    },
    id: d.id,
    created: formatDate(d.createdDate),
    updated: formatDate(d.lastModifiedDate),
    num: d.items.total,
    views: p.aboveTheFoldData.pageViews,
    cover: d.primaryImage?.image?.url ?? null,
  };

  const pagination = {
    total: p.totalItems,
    // change later
    cur: 0,
    pageNum: p.initialPageNumber,
  };

  // 1. images list
  if (d.listType.id === 'IMAGES') {
    const data = d.imageItems.edges.map(i => ({
      caption: i.node.listItem.caption?.plainText ?? null,
      image: i.node.listItem.url,
      imageId: i.node.listItem.id,
      names: i.node.listItem.names?.map(n => ({ name: n.nameText.text, nameId: n.id })) ?? [],
      titles: i.node.listItem.titles?.map(t => ({ name: t.titleText.text, titleId: t.id })) ?? [],
      userDescription: i.node.description?.originalText?.plaidHtml ?? null,
    }));

    pagination.cur = data.length;

    return { meta, pagination, data, type: d.listType.id } as const;
  }

  // 2. movies list
  if (d.listType.id === 'TITLES') {
    const data = d.titleListItemSearch.edges.map(title => ({
      userDescription: title.node.description?.originalText?.plaidHtml ?? null,
      titleId: title.title.id,
      image: title.title.primaryImage?.url ?? null,
      name: title.title.titleText.text,
      url: `/title/${title.title.id}`,
      year: title.title.releaseYear?.year.toString() ?? null,
      certificate: title.title.certificate?.rating ?? null,
      runtime: title.title.runtime?.seconds ?? null,
      genres: title.title.titleGenres?.genres.map(genre => genre.genre.text) ?? [],
      plot: title.title.plot?.plotText?.plainText ?? null,
      rating: {
        score: title.title.ratingsSummary.aggregateRating,
        voteCount: title.title.ratingsSummary.voteCount,
      },
      metascore: title.title.metacritic?.metascore.score ?? null,
      otherInfo: title.title.principalCreditsV2.map(credit => [
        credit.grouping.text,
        ...credit.credits.map(credit => credit.name.nameText.text),
      ]),
    }));

    pagination.cur = data.length;

    return { meta, pagination, data, type: d.listType.id } as const;
  }

  // 3. actors list
  else if (d.listType.id === 'PEOPLE') {
    const data = d.nameListItemSearch.edges.map(name => ({
     nameId: name.name.id,
      userDescription: name.node.description?.originalText?.plaidHtml ?? null,
      image: name.name.primaryImage?.url || null,
      name: name.name.nameText.text,
      url: `/name/${name.name.id}`,
      jobs: name.name.professions.map(profession => profession.profession.text),
      knownFor: name.name.knownForV2.credits.map(credit => {
        return { title: credit.title.titleText.text, url: `/title/${credit.title.id}` };
      }),
      about:
        htmlToText(name.name.bio.displayableArticle.body.plaidHtml).slice(0, 400) + '...',
    }));

    pagination.cur = data.length;
    return { meta, pagination, data, type: d.listType.id } as const;
  }

  return { meta, pagination, data: [], type: d.listType.id } as const;
};

export default cleanList;
