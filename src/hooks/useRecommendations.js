import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useRecommendations = (limit = 10) => {
  return useQuery({
    queryKey: ['recommendations', limit],
    queryFn: async () => {
      try {
        console.log('📡 Fetching recommendations...');
        const token = localStorage.getItem('access_token');
        console.log('🔑 Token exists:', !!token);
        
        const response = await api.get(`/books/recommendations/?limit=${limit}`);
        console.log('📦 Recommendations response:', response.data);
        
        // Handle different response formats
        let recommendationsData = [];
        if (Array.isArray(response.data)) {
          recommendationsData = response.data;
        } else if (response.data?.recommendations) {
          recommendationsData = response.data.recommendations;
        } else if (response.data?.results) {
          recommendationsData = response.data.results;
        }
        
        console.log('✅ Processed recommendations:', recommendationsData);
        return recommendationsData;
      } catch (err) {
        console.error('❌ Error fetching recommendations:', err);
        return [];
      }
    },
    enabled: !!localStorage.getItem('access_token')
  });
};