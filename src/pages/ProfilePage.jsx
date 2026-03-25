import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useState } from 'react';
import AvatarUpload from '../components/profile/AvatarUpload';
import EditProfileModal from '../components/profile/EditProfileModal';
import FollowButton from '../components/profile/FollowButton';
import { BookOpenIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data } = await api.get(`/accounts/users/${id}/`);
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">User not found</h2>
        <p className="text-gray-600">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-blue-600 font-bold">
                    {profile.username?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                  title="Change avatar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <p className="text-gray-600 mt-1">{profile.bio || 'No bio yet'}</p>
            </div>
          </div>

          {/* Follow/Edit Buttons */}
          {!isOwnProfile && <FollowButton userId={profile.id} />}
          {isOwnProfile && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* STATS CARDS - Add this section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Books Read Card */}
          <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Books Read</p>
              <p className="text-2xl font-bold text-gray-800">
                {profile.reading_list_stats?.read || 0}
              </p>
            </div>
          </div>

          {/* Reviews Written Card */}
          <div className="bg-yellow-50 rounded-lg p-4 flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reviews Written</p>
              <p className="text-2xl font-bold text-gray-800">
                {profile.reviews_count || 0}
              </p>
            </div>
          </div>

          {/* Followers Card */}
          <div className="bg-green-50 rounded-lg p-4 flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-800">
                {profile.followers_count || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Reading Stats Section */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Reading Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Books Read</div>
              <div className="text-2xl font-bold">
                {profile.reading_list_stats?.read || 0}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Currently Reading</div>
              <div className="text-2xl font-bold">
                {profile.reading_list_stats?.currently_reading || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Genres */}
        {profile.favorite_genre && profile.favorite_genre.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Favorite Genres</h3>
            <div className="flex flex-wrap gap-2">
              {profile.favorite_genre.map((genre, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
    <div className="text-2xl font-bold text-yellow-600">
      {profile?.reading_goal || 12}
    </div>
    <div className="text-sm text-gray-600">Yearly Goal</div>
  </div>
      </div>

      {/* Modals */}
      {isAvatarModalOpen && (
        <AvatarUpload onClose={() => setIsAvatarModalOpen(false)} />
      )}
      {isEditModalOpen && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
}