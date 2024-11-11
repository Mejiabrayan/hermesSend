'use client';

import { useQueryStates } from 'nuqs';
import { parseAsString, parseAsInteger, parseAsBoolean } from 'nuqs';

export function useViewPreferences() {
  return useQueryStates({
    theme: parseAsString.withDefault('system'),
    density: parseAsString.withDefault('comfortable'),
    defaultView: parseAsString.withDefault('table'),
    pageSize: parseAsInteger.withDefault(10),
    showPreview: parseAsBoolean.withDefault(true),
  }, {
    history: 'replace',
    shallow: true,
    // Persist these preferences in localStorage
    startTransition: false,
  });
} 