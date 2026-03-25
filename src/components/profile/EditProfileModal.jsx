import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function EditProfileModal({ onClose }) {
  const { user, fetchUser } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    reading_goal: user?.reading_goal || 12,
    favorite_genre: user?.favorite_genre?.join(', ') || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = {
      username: user?.username,
      email: user?.email,
      bio: formData.bio,
      reading_goal: parseInt(formData.reading_goal)
    };

    if (formData.favorite_genre.trim()) {
      data.favorite_genre = formData.favorite_genre
        .split(',')
        .map(g => g.trim())
        .filter(g => g.length > 0);
    } else {
      data.favorite_genre = [];
    }

    try {
      const response = await api.put('/accounts/profile/', data);
      console.log('✅ Profile updated:', response.data);
      
      // Update user context
      await fetchUser();
      
      // Force profile page to refresh
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('❌ Error:', error.response?.data);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reading Goal (books/year)
            </label>
            <input
              type="number"
              value={formData.reading_goal}
              onChange={(e) => setFormData({...formData, reading_goal: e.target.value})}
              min="1"
              max="100"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Genres (comma separated)
            </label>
            <input
              type="text"
              value={formData.favorite_genre}
              onChange={(e) => setFormData({...formData, favorite_genre: e.target.value})}
              placeholder="fiction, mystery, fantasy"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}