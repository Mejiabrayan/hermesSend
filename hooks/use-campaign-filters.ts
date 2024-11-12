'use client';

import { useQueryStates } from 'nuqs';
import { parseAsString } from 'nuqs';

export function useCampaignFilters() {
  return useQueryStates(
    {
      status: parseAsString.withDefault('all'),
      search: parseAsString.withDefault(''),
      sort: parseAsString.withDefault('created_at'),
      order: parseAsString.withDefault('desc'),
    },
    {
      history: 'replace',
      shallow: true,
    }
  );
} 