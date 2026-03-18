import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useComments } from '../../hooks/useComments';
import { formatDistanceToNow } from 'date-fns';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CommentSection({ reviewId }) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const { 
    comments, 
    isLoading, 
    createComment, 
    updateComment, 
    deleteComment, 
    isCreating 
  } = useComments(reviewId);

  if (!user) {
    return (
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-500 text-center">
          Please login to comment
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createComment({ text: newComment });
    setNewComment('');
  };

  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const handleUpdate = (commentId) => {
    if (!editText.trim()) return;
    updateComment({ commentId, text: editText });
    setEditingId(null);
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      deleteComment(commentId);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="font-medium mb-3 flex items-center justify-between">
        <span>Comments ({comments?.length || 0})</span>
      </h4>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isCreating}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </form>

      {/* Comments list */}
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {comments?.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3 text-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {comment.user_details?.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                {user?.id === comment.user && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(comment)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <PencilIcon className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="flex space-x-2 mt-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate(comment.id)}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-gray-700 text-xs leading-relaxed">{comment.text}</p>
              )}
            </div>
          ))}

          {comments?.length === 0 && (
            <p className="text-center text-gray-400 text-xs py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}