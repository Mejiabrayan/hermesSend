'use client';

import { useQueryStates } from 'nuqs';
import { parseAsString, parseAsArrayOf } from 'nuqs';

const statusOptions = ['all', 'draft', 'sending', 'sent', 'failed'] as const;

export function useCampaignFilters() {
  return useQueryStates({
    status: parseAsString.withDefault('all'),
    search: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('created_at'),
    order: parseAsString.withDefault('desc'),
    tags: parseAsArrayOf(parseAsString).withDefault([]),
  }, {
    history: 'replace', // Don't create history entries for filter changes
    shallow: true, // Don't trigger server-side revalidation
  });
} 