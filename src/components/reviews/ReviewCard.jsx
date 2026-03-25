import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { PencilIcon, TrashIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import CommentSection from '../comments/CommentSection';

export default function ReviewCard({ review, onEdit, onDelete, onLike }) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const isOwner = user?.id === review.user;
  
  // Check if current user has liked this review
  const userHasLiked = review.likes?.includes(user?.id) || review.user_has_liked;

  console.log('ReviewCard rendering with review:', review);

  const handleLike = async () => {
    if (isLiking || !onLike) return;
    
    setIsLiking(true);
    try {
      await onLike(review.id);
    } catch (error) {
      console.error('Error liking review:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 hover:shadow-md transition-shadow">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {review.user_details?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold">{review.user_details?.username}</p>
            <p className="text-xs text-gray-500">
              Read on {format(new Date(review.date_read), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        {/* Star Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Spoiler Warning */}
      {review.spoiler && (
        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mb-2">
          ⚠️ Contains Spoilers
        </span>
      )}

      {/* Review Text */}
      <p className="text-gray-700 mb-3">{review.text}</p>

      {/* Review Footer - Like Button and Edit/Delete */}
      <div className="flex items-center justify-between border-t pt-2 mt-2">
        {/* Like Button - visible to everyone */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          {userHasLiked ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span className="text-sm">{review.likes_count || review.likes?.length || 0}</span>
        </button>

        {/* Edit/Delete Buttons (only for owner) */}
        {isOwner && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                console.log('✏️ Edit clicked for review:', review);
                onEdit(review);
              }}
              className="text-gray-500 hover:text-blue-600 flex items-center space-x-1"
            >
              <PencilIcon className="h-4 w-4" />
              <span className="text-sm">Edit</span>
            </button>
            <button
              onClick={() => {
                console.log('🗑️ Delete clicked for review:', review.id);
                if (window.confirm('Delete this review?')) {
                  onDelete(review.id);
                }
              }}
              className="text-gray-500 hover:text-red-600 flex items-center space-x-1"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Comment toggle button */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-xs text-gray-500 hover:text-blue-600 flex items-center space-x-1 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{showComments ? 'Hide' : 'Show'} comments</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <CommentSection reviewId={review.id} />
      )}
    </div>
  );
}