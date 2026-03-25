import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useFollow = (userId) => {
  const queryClient = useQueryClient();

  const useFollowers = () => {
    return useQuery({
      queryKey: ['followers', userId],
      queryFn: async () => {
        const { data } = await api.get(`/accounts/users/${userId}/followers/`);
        return data;
      },
      enabled: !!userId
    });
  };

  const useFollowing = () => {
    return useQuery({
      queryKey: ['following', userId],
      queryFn: async () => {
        const { data } = await api.get(`/accounts/users/${userId}/following/`);
        return data;
      },
      enabled: !!userId
    });
  };

  const followUser = useMutation({
    mutationFn: async (followUserId) => {
      console.log('👥 Following user:', followUserId);
      const response = await api.post(`/accounts/users/${followUserId}/follow/`);
      return response.data;
    },
    onSuccess: (data, followUserId) => {
      queryClient.invalidateQueries({ queryKey: ['followers', followUserId] });
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
      queryClient.invalidateQueries({ queryKey: ['user', followUserId] });
      queryClient.invalidateQueries({ queryKey: ['profile', followUserId] });
      queryClient.invalidateQueries({ queryKey: ['profile'] }); // Add this line
    },
    onError: (error) => {
      console.error('❌ Follow error:', error.response?.data);
    }
  });

  const unfollowUser = useMutation({
    mutationFn: async (followUserId) => {
      console.log('👥 Unfollowing user:', followUserId);
      await api.delete(`/accounts/users/${followUserId}/follow/`);
    },
    onSuccess: (data, followUserId) => {
      queryClient.invalidateQueries({ queryKey: ['followers', followUserId] });
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
      queryClient.invalidateQueries({ queryKey: ['user', followUserId] });
      queryClient.invalidateQueries({ queryKey: ['profile', followUserId] });
      queryClient.invalidateQueries({ queryKey: ['profile'] }); // Add this line
    },
    onError: (error) => {
      console.error('❌ Unfollow error:', error.response?.data);
    }
  });

  const useIsFollowing = (targetUserId) => {
    const { data: following } = useQuery({
      queryKey: ['following', userId],
      queryFn: async () => {
        const { data } = await api.get(`/accounts/users/${userId}/following/`);
        return data;
      },
      enabled: !!userId && !!targetUserId
    });

    return following?.some(f => f.followed === targetUserId) || false;
  };

  return {
    useFollowers,
    useFollowing,
    useIsFollowing,
    followUser: followUser.mutateAsync,
    unfollowUser: unfollowUser.mutateAsync,
    isFollowing: followUser.isPending,
    isUnfollowing: unfollowUser.isPending
  };
};