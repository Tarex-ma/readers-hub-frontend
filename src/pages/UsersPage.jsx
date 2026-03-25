import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [actionInProgress, setActionInProgress] = useState({});

  // Fetch all users
  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/accounts/users/');
      if (response.data?.results) return response.data.results;
      if (Array.isArray(response.data)) return response.data;
      return [];
    }
  });

  // Fetch following list
  const { data: followingData, isLoading: followingLoading, refetch: refetchFollowing } = useQuery({
    queryKey: ['following', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await api.get(`/accounts/users/${user.id}/following/`);
      if (response.data?.results) return response.data.results;
      if (Array.isArray(response.data)) return response.data;
      return [];
    },
    enabled: !!user
  });

  // Create a Set of followed user IDs
  const followedUserIds = new Set(
  followingData?.map(f => f.followed.id) || []
);
  console.log('Followed user IDs:', [...followedUserIds]);

  const users = usersData || [];
  const otherUsers = users.filter(u => u.id !== user?.id);

  const handleFollow = async (targetUserId) => {
    if (actionInProgress[targetUserId]) return;
    
    setActionInProgress(prev => ({ ...prev, [targetUserId]: true }));
    
    try {
      const isCurrentlyFollowed = followedUserIds.has(targetUserId);
      
      if (isCurrentlyFollowed) {
        await api.delete(`/accounts/users/${targetUserId}/follow/`);
        toast.success('User unfollowed');
      } else {
        await api.post(`/accounts/users/${targetUserId}/follow/`);
        toast.success('User followed!');
      }
      
      // Refetch the following list to update UI
      queryClient.invalidateQueries(['following', user?.id]);
      
    } catch (error) {
      console.error('Action error:', error);
      toast.error(error.response?.data?.error || 'Action failed');
    } finally {
      setActionInProgress(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  if (usersLoading || followingLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Readers</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Readers</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Error loading users</p>
        </div>
      </div>
    );
  }

  if (otherUsers.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Readers</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-800 mb-2">No other users found</p>
          <p className="text-blue-600 text-sm">Create another account to test following!</p>
          <Link 
            to="/register"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Discover Readers</h1>
      <p className="text-gray-500 text-sm mb-6">
        Find and follow other book lovers in the community
      </p>

      <div className="space-y-4">
        {otherUsers.map((otherUser) => {
          const isFollowing = followedUserIds.has(otherUser.id);
          
          return (
            <div
              key={otherUser.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Link to={`/profile/${otherUser.id}`} className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                      {otherUser.avatar ? (
                        <img
                          src={otherUser.avatar}
                          alt={otherUser.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl text-blue-600 font-bold">
                          {otherUser.username?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/profile/${otherUser.id}`}
                      className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {otherUser.username}
                    </Link>
                    
                    {otherUser.bio ? (
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {otherUser.bio}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No bio yet</p>
                    )}

                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>
                        <span className="font-semibold text-gray-700">{otherUser.followers_count || 0}</span> followers
                      </span>
                      <span>
                        <span className="font-semibold text-gray-700">{otherUser.reviews_count || 0}</span> reviews
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleFollow(otherUser.id)}
                  disabled={actionInProgress[otherUser.id]}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {actionInProgress[otherUser.id] ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>{isFollowing ? 'Unfollowing...' : 'Following...'}</span>
                    </>
                  ) : isFollowing ? (
                    <>
                      <UserMinusIcon className="h-4 w-4" />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="h-4 w-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}