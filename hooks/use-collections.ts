'use client';

import { useQuery } from '@tanstack/react-query';

import { getCollectionsAction } from '@/lib/actions/dashboard/get-collections-action';

export const useCollections = (search: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['collections', search],
    queryFn: async () => {
      const result = await getCollectionsAction(search || undefined);

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },
    enabled: enabled && (search.length === 0 || search.length > 2),
  });
};
