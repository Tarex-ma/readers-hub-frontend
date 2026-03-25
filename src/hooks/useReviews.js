import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useReviews = (bookId) => {
  const queryClient = useQueryClient();

  // Get reviews for a book
  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', bookId],
    queryFn: async () => {
      try {
        console.log('📡 Fetching reviews for book:', bookId);
        const response = await api.get(`/books/${bookId}/reviews/`);
        console.log('📦 API Response:', response.data);
        
        // Handle different response formats
        let reviewsData = [];
        if (Array.isArray(response.data)) {
          reviewsData = response.data;
        } else if (response.data?.results) {
          reviewsData = response.data.results;
        } else if (response.data && typeof response.data === 'object') {
          reviewsData = [response.data];
        }
        
        return reviewsData;
      } catch (err) {
        console.error('❌ Error fetching reviews:', err);
        return [];
      }
    },
    enabled: !!bookId
  });

  // Create review - FIXED format
  const createReview = useMutation({
    mutationFn: async (reviewData) => {
      console.log('📝 Creating review with data:', reviewData);
      
      // Format data exactly as backend expects
      const formattedData = {
        book: bookId,
        rating: reviewData.rating,
        text: reviewData.text,
        date_read: reviewData.date_read,
        spoiler: reviewData.spoiler || false
      };
     
      console.log('📤 Sending formatted data:', formattedData);
      const response = await api.post(`/books/${bookId}/reviews/`, formattedData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Review created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      toast.success('Review posted successfully!');
    },
    onError: (error) => {
      console.error('❌ Create error:', error.response?.data);
      
      // Show detailed error message
      if (error.response?.data) {
        const errorMessages = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('\n');
        toast.error(errorMessages || 'Failed to post review');
      } else {
        toast.error('Failed to post review');
      }
    }
  });

  // Update review - FIXED format
  const updateReview = useMutation({
    mutationFn: async ({ reviewId, ...reviewData }) => {
      console.log('📝 Updating review:', { reviewId, reviewData });
      
      // Format data exactly as backend expects
      const formattedData = {
        book: bookId,
        rating: reviewData.rating,
        text: reviewData.text,
        date_read: reviewData.date_read,
        spoiler: reviewData.spoiler || false
      };
      
      console.log('📤 Sending update data:', formattedData);
      const response = await api.put(`/books/${bookId}/reviews/${reviewId}/`, formattedData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Review updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      toast.success('Review updated successfully!');
    },
    onError: (error) => {
      console.error('❌ Update error:', error.response?.data);
      
      if (error.response?.data) {
        const errorMessages = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value.join(', ')}`)
          .join('\n');
        toast.error(errorMessages || 'Failed to update review');
      } else {
        toast.error('Failed to update review');
      }
    }
  });

  // Delete review
  const deleteReview = useMutation({
    mutationFn: async (reviewId) => {
      console.log('🗑️ Deleting review:', reviewId);
      await api.delete(`/books/${bookId}/reviews/${reviewId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      toast.success('Review deleted successfully');
    },
    onError: (error) => {
      console.error('❌ Delete error:', error.response?.data);
      toast.error('Failed to delete review');
    }
  });

  // Like review
  const likeReview = useMutation({
    mutationFn: async (reviewId) => {
      console.log('❤️ Liking review:', reviewId);
      const response = await api.post(`/books/reviews/${reviewId}/like/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      toast.success('Review liked!');
    },
    onError: (error) => {
      console.error('❌ Like error:', error.response?.data);
      toast.error('Failed to like review');
    }
  });

  return {
    reviews: data || [],
    isLoading,
    error,
    createReview: createReview.mutate,
    updateReview: updateReview.mutate,
    deleteReview: deleteReview.mutate,
    likeReview: likeReview.mutate,
    isCreating: createReview.isPending,
    isUpdating: updateReview.isPending,
    isDeleting: deleteReview.isPending,
    isLiking: likeReview.isPending
  };
};