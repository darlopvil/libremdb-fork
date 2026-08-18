export const sortBy = {
  types: [
    { name: 'Episode', val: 'episode' },
    { name: 'Rating', val: 'rating' },
    { name: 'Release Date', val: 'release' },
  ],
  key: 'sort',
} as const;

export const direction = {
  types: [
    { name: 'Ascending', val: 'asc' },
    { name: 'Descending', val: 'desc' },
  ],
  key: 'dir',
} as const;

export const keys = ['season', 'year', sortBy.key, direction.key];