type TitleEntity = {
  id: string;
  titleText: { text: string };
  originalTitleText: { text: string };
  titleType: { id: string; text: string; canHaveEpisodes: boolean };
  releaseYear: { year: number; endYear: number | null } | null;
  runtime: { seconds: number } | null;
  certificate: { rating: string } | null;
  plot: { plotText: { plainText: string } | null } | null;
  ratingsSummary: { aggregateRating: number | null; voteCount: number | null };
  primaryImage: { url: string; caption: { plainText: string } | null } | null;
};
type NameEntity = {
  id: string;
  nameText: { text: string };
  primaryProfessions: Array<{ category: { text: string } }> | null;
  knownFor: {
    edges: Array<{
      node: { credit: { title: { titleText: { text: string }; releaseYear: { year: number } | null } } };
    }>;
  } | null;
  primaryImage: { url: string; caption: { plainText: string } | null } | null;
  bio: { text: { plainText: string } | null } | null;
};
type CompanyEntity = {
  id: string;
  companyText: { text: string };
  companyTypes: Array<{ text: string }>;
  country: { text: string } | null;
};
type KeywordEntity = {
  id: string;
  text: { text: string };
  titles: { total: number } | null;
};
type SearchBucket<T> = { edges: Array<{ node: { entity: T } }> };

export default interface RawFind {
  titleResults: SearchBucket<TitleEntity>;
  nameResults: SearchBucket<NameEntity>;
  companyResults: SearchBucket<CompanyEntity>;
  keywordResults: SearchBucket<KeywordEntity>;
}
