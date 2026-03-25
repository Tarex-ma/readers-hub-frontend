// src/hooks/useActivities.js
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useFeed = () => {
  return useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      try {
        console.log('📡 Fetching activity feed...');
        
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found');

        const response = await api.get('/activities/feed/'); // correct backend URL

        console.log('📦 Feed data:', response.data);

        let feedData = [];
        if (Array.isArray(response.data)) {
          feedData = response.data;
        } else if (response.data?.results) {
          feedData = response.data.results;
        }

        console.log('✅ Processed feed data:', feedData);
        return feedData;
      } catch (err) {
        // Show full error so you actually know what failed
        console.error('❌ Error fetching feed:', err.response?.data || err.message);
        throw err; // don’t silently return []; let useQuery know
      }
    },
    enabled: !!localStorage.getItem('access_token'),
  });
};

export const useUserActivities = (userId) => {
  return useQuery({
    queryKey: ['userActivities', userId],
    queryFn: async () => {
      try {
        if (!userId) throw new Error('No userId provided');

        console.log('📡 Fetching activities for user:', userId);
        const response = await api.get(`/activities/users/${userId}/activities/`);
        console.log('📦 User activities:', response.data);
        return response.data;
      } catch (err) {
        console.error('❌ Error fetching user activities:', err.response?.data || err.message);
        return [];
      }
    },
    enabled: !!userId,
  });
};