import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useBooks = (params = {}) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: async () => {
      const { data } = await api.get('/books/', { params });
      return data;
    }
  });
};