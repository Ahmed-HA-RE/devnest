import { QueryClient, isServer } from '@tanstack/react-query';
import { cache } from 'react';

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

const getServerQueryClient = cache(makeQueryClient);

export const getQueryClient = () => {
  if (isServer) {
    return getServerQueryClient();
  }

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};