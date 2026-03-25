import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function EditReviewModal({ review, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    rating: 5,
    text: '',
    date_read: new Date().toISOString().split('T')[0],
    spoiler: false
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load review data when modal opens
  useEffect(() => {
    if (review) {
      setFormData({
        rating: review.rating,
        text: review.text,
        date_read: review.date_read,
        spoiler: review.spoiler || false
      });
    }
  }, [review]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(review.id, formData);
      onClose();
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Review</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className="focus:outline-none"
                >
                  <span className={star <= formData.rating ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date Read */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Read
            </label>
            <input
              type="date"
              value={formData.date_read}
              onChange={(e) => setFormData({...formData, date_read: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Spoiler Checkbox */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.spoiler}
                onChange={(e) => setFormData({...formData, spoiler: e.target.checked})}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                This review contains spoilers
              </span>
            </label>
          </div>

          {/* Buttons */}
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
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}