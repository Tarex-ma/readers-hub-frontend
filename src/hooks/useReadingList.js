import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';
import { getCurrentUserId } from '../utils/userHelpers';

export const useReadingList = () => {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId(); 

  const { data, isLoading, error } = useQuery({
    queryKey: ['readingList'],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.log('No token found, returning empty array');
          return [];
        }
        
        console.log('Fetching reading list...');
        const response = await api.get('/books/my-reading-list/');
        console.log('API Response:', response.data);
        
        // Handle different response formats
        let readingListData = [];
        if (response.data && response.data.results) {
          readingListData = response.data.results;
        } else if (Array.isArray(response.data)) {
          readingListData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          readingListData = [response.data];
        } else {
          readingListData = [];
        }
        
        console.log('Processed reading list:', readingListData);
        return readingListData;
      } catch (error) {
        console.error('Error fetching reading list:', error);
        return [];
      }
    },
    enabled: !!localStorage.getItem('access_token')
  });

  const addToReadingList = useMutation({
    mutationFn: async ({ bookId, status }) => {
      console.log('Adding to reading list:', { bookId, status });
      const response = await api.post('/books/my-reading-list/', { 
        book: bookId, 
        status 
      });
      return response.data;
    },
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingList'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      }
      toast.success('Added to reading list');
    },
    onError: (error) => {
      console.error('Add error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to reading list');
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      console.log('Updating status:', { id, status });
      const response = await api.patch(`/books/my-reading-list/${id}/`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingList'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      }
      toast.success('Added to reading list');
    }
  });

  const updateProgress = useMutation({
    mutationFn: async ({ id, currentPage }) => {
      console.log('Updating progress:', { id, currentPage });
      const response = await api.patch(`/books/my-reading-list/${id}/`, { 
        current_page: currentPage 
      });
      return response.data;
    },
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingList'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      }
      toast.success('Added to reading list');
    },
    onError: (error) => {
      console.error('Progress error:', error);
      toast.error('Failed to update progress');
    }
  });

  const removeFromList = useMutation({
    mutationFn: async (id) => {
      console.log('Removing from list:', id);
      await api.delete(`/books/my-reading-list/${id}/`);
    },
   onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingList'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      }
      toast.success('Added to reading list');
    }
  });

  return {
    readingList: data || [],
    isLoading,
    error,
    addToReadingList: addToReadingList.mutate,
    updateStatus: updateStatus.mutate,
    updateProgress: updateProgress.mutate,
    removeFromList: removeFromList.mutate,
    isAdding: addToReadingList.isPending,
    isUpdating: updateStatus.isPending,
    isRemoving: removeFromList.isPending
  };
};