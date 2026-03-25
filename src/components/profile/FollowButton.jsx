import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFollow } from '../../hooks/useFollow';
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function FollowButton({ userId }) {
  const { user } = useAuth();
  const { followUser, unfollowUser, isFollowing, isUnfollowing } = useFollow(user?.id);

  const [isFollowed, setIsFollowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);

  const buttonRef = useRef(null);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || user.id === userId) {
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/accounts/users/${user.id}/following/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        );

        const data = await response.json();
        const isUserFollowed = data.some(f => f.followed === userId);
        setIsFollowed(isUserFollowed);
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkFollowStatus();
  }, [user, userId]);

  if (!user || user.id === userId) return null;

  const handleFollowClick = async () => {
    if (actionInProgress || isFollowing || isUnfollowing) return;

    setActionInProgress(true);

    try {
      if (isFollowed) {
        await unfollowUser(userId);
        setIsFollowed(false);
        toast.success('User unfollowed');
      } else {
        await followUser(userId);
        setIsFollowed(true);
        toast.success('User followed!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Action failed');
    } finally {
      setTimeout(() => setActionInProgress(false), 500);
    }
  };

  if (checking) {
    return (
      <button disabled className="px-4 py-2 bg-gray-300 rounded-lg">
        Loading...
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleFollowClick}
      disabled={actionInProgress || isFollowing || isUnfollowing}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
        isFollowed
          ? 'bg-gray-200 text-gray-700'
          : 'bg-blue-600 text-white'
      } disabled:opacity-50`}
    >
      {(actionInProgress || isFollowing || isUnfollowing) ? (
        <span>Loading...</span>
      ) : isFollowed ? (
        <>
          <UserMinusIcon className="h-5 w-5" />
          <span>Unfollow</span>
        </>
      ) : (
        <>
          <UserPlusIcon className="h-5 w-5" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
}