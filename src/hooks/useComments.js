import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useComments = (reviewId) => {
  const queryClient = useQueryClient();

  // Get comments for a review
  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', reviewId],
    queryFn: async () => {
      try {
        console.log('📡 Fetching comments for review:', reviewId);
        const response = await api.get(`/comments/reviews/${reviewId}/comments/`);
        console.log('📦 Comments response:', response.data);
        
        // Handle different response formats
        let commentsData = [];
        if (Array.isArray(response.data)) {
          commentsData = response.data;
        } else if (response.data?.results) {
          commentsData = response.data.results;
        }
        
        return commentsData;
      } catch (err) {
        console.error('❌ Error fetching comments:', err);
        return [];
      }
    },
    enabled: !!reviewId
  });

  // Create comment - FIXED
  const createComment = useMutation({
    mutationFn: async ({ text }) => {
      console.log('📝 Creating comment:', { text, reviewId });
      // IMPORTANT: Send both text AND review ID
      const response = await api.post(`/comments/reviews/${reviewId}/comments/`, { 
        text,
        review: reviewId  // Add this - backend expects review field
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      toast.success('Comment added!');
    },
    onError: (error) => {
      console.error('❌ Create comment error:', error.response?.data);
      toast.error('Failed to add comment');
    }
  });

  // Update comment
  const updateComment = useMutation({
    mutationFn: async ({ commentId, text }) => {
      console.log('📝 Updating comment:', { commentId, text });
      const response = await api.put(`/comments/comments/${commentId}/`, { 
        text,
        review: reviewId  // Might need this too
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      toast.success('Comment updated');
    },
    onError: (error) => {
      console.error('❌ Update comment error:', error.response?.data);
      toast.error('Failed to update comment');
    }
  });

  // Delete comment
  const deleteComment = useMutation({
    mutationFn: async (commentId) => {
      console.log('🗑️ Deleting comment:', commentId);
      await api.delete(`/comments/comments/${commentId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', reviewId] });
      toast.success('Comment deleted');
    },
    onError: (error) => {
      console.error('❌ Delete comment error:', error.response?.data);
      toast.error('Failed to delete comment');
    }
  });

  return {
    comments: data || [],
    isLoading,
    error,
    createComment: createComment.mutate,
    updateComment: updateComment.mutate,
    deleteComment: deleteComment.mutate,
    isCreating: createComment.isPending,
    isUpdating: updateComment.isPending,
    isDeleting: deleteComment.isPending
  };
};