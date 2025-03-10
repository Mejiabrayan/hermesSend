'use client';

import { useQueryStates } from 'nuqs';
import { parseAsString, parseAsArrayOf } from 'nuqs';

export function useContactFilters() {
  return useQueryStates({
    status: parseAsArrayOf(parseAsString).withDefault([]),
    search: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('created_at'),
    order: parseAsString.withDefault('desc'),
    tags: parseAsArrayOf(parseAsString).withDefault([]),
    lastEmailed: parseAsString.withDefault('all'), // all, never, last7days, last30days
  }, {
    history: 'replace',
    shallow: true,
  });
} 