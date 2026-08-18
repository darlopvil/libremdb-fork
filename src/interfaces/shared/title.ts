import cleanTitle from 'src/utils/cleaners/title';
import title from 'src/utils/fetchers/title';

// for full title
type Title = ReturnType<typeof cleanTitle>;
export type { Title as default };

export type Basic = Title['basic'];

export type Media = Title['media'];

export type Cast = Title['cast'];

export type DidYouKnow = Title['didYouKnow'];

export type Info = Pick<
  Title,
  'meta' | 'keywords' | 'details' | 'boxOffice' | 'technicalSpecs' | 'accolades' | 'faqs'
>;

export type Reviews = Title['reviews'];

export type MoreLikeThis = Title['moreLikeThis'];
