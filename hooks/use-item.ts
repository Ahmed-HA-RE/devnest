'use client';

import { useQuery } from '@tanstack/react-query';

import { getItemAction } from '@/lib/actions/dashboard/get-items-action';

export const useItem = (itemId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ['item', itemId],
    queryFn: async () => {
      const result = await getItemAction(itemId as string);

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },
    enabled: enabled && !!itemId,
  });
};