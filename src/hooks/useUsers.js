import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const { data } = await api.get('/accounts/users/', { params });
      return data;
    }
  });
};

export const useUserDetail = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await api.get(`/accounts/users/${userId}/`);
      return data;
    },
    enabled: !!userId
  });
};

export const useUserStats = (userId) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      const { data } = await api.get(`/accounts/users/${userId}/stats/`);
      return data;
    },
    enabled: !!userId
  });
};