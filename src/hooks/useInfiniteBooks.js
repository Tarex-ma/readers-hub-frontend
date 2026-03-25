import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useInfiniteBooks = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ['books', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get('/books/', {
        params: { ...filters, page: pageParam, page_size: 12 }
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return url.searchParams.get('page');
    },
    initialPageParam: 1
  });
};