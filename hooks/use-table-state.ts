'use client';

import { useQueryStates } from 'nuqs';
import { parseAsString, parseAsInteger } from 'nuqs';

export function useTableState() {
  return useQueryStates({
    sort: parseAsString.withDefault('created_at'),
    order: parseAsString.withDefault('desc'),
    page: parseAsInteger.withDefault(1),
    size: parseAsInteger.withDefault(10),
    view: parseAsString.withDefault('table'), // For different view modes (table/grid)
    columns: parseAsString.withDefault(''), // For visible columns
  }, {
    history: 'replace',
    shallow: true,
  });
} 