import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ReviewForm({ onSubmit, isSubmitting, bookId }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rating: 5,
    text: '',
    date_read: new Date().toISOString().split('T')[0],
    spoiler: false
  });

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">Please login to write a review</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.text.trim()) {
      toast.error('Please write your review');
      return;
    }
    
    if (!formData.date_read) {
      toast.error('Please select a date');
      return;
    }
    
    console.log('📝 Submitting review data:', formData);
    
    // Submit the data directly
    onSubmit(formData);
    
    // Reset form after submission
    setFormData({
      rating: 5,
      text: '',
      date_read: new Date().toISOString().split('T')[0],
      spoiler: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      {/* Rating */}
      <div className="mb-4">
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
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData({...formData, text: e.target.value})}
          rows="4"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Share your thoughts about this book..."
          required
        />
      </div>

      {/* Date Read */}
      <div className="mb-4">
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
      <div className="mb-4">
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.text.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Posting...' : 'Post Review'}
      </button>
    </form>
  );
}