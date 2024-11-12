'use client';

import { useQueryStates } from 'nuqs';
import { parseAsString } from 'nuqs';

export function useViewPreferences() {
  return useQueryStates(
    {
      view: parseAsString.withDefault('grid'),
      sort: parseAsString.withDefault('created_at'),
      order: parseAsString.withDefault('desc'),
    },
    {
      history: 'replace',
      shallow: true,
    }
  );
} 