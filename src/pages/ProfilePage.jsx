import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useState } from 'react';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data } = await api.get(`/auth/users/${id}/`);
      return data;
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return <div className="text-center py-8">User not found</div>;

  const isOwnProfile = currentUser?.id === parseInt(id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl text-blue-600 font-bold">
                {profile.username[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <p className="text-gray-600 mt-1">{profile.bio || 'No bio yet'}</p>
            </div>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="btn-secondary"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{profile.followers_count || 0}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{profile.following_count || 0}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{profile.reviews_count || 0}</div>
            <div className="text-sm text-gray-600">Reviews</div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Reading Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Books Read</div>
              <div className="text-2xl font-bold">{profile.reading_list_stats?.read || 0}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Currently Reading</div>
              <div className="text-2xl font-bold">{profile.reading_list_stats?.currently_reading || 0}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">Favorite Genres</div>
            <div className="flex flex-wrap gap-2">
              {profile.favorite_genres?.map(genre => (
                <span key={genre} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
              {(!profile.favorite_genres || profile.favorite_genres.length === 0) && (
                <span className="text-gray-400">No favorite genres listed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
}