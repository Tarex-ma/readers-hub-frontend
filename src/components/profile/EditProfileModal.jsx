import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    reading_goal: user?.reading_goal || 12,
    favorite_genres: user?.favorite_genres?.join(', ') || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = {
      bio: formData.bio,
      reading_goal: parseInt(formData.reading_goal),
      favorite_genres: formData.favorite_genres.split(',').map(g => g.trim()).filter(g => g)
    };

    try {
      await api.put('/auth/profile/', data);
      await fetchUser();
      toast.success('Profile updated!');
      onClose();
    } catch (error) {
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border rounded-md"
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
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Genres (comma separated)
            </label>
            <input
              type="text"
              value={formData.favorite_genres}
              onChange={(e) => setFormData({...formData, favorite_genres: e.target.value})}
              placeholder="fiction, mystery, fantasy"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}