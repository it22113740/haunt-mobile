import { showToast } from '@/components/toast';
import { getApiErrorMessage } from '@/lib/api-error';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

function toastIfUseful(error: unknown, fallback: string) {
  if (isAxiosError(error) && error.response?.status === 401) return;
  showToast(getApiErrorMessage(error, fallback), 'warning');
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data === undefined) return;
      toastIfUseful(error, 'Couldn’t refresh. Try again.');
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toastIfUseful(error, 'Something went wrong. Try again.');
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isAxiosError(error) && error.response?.status === 401) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
