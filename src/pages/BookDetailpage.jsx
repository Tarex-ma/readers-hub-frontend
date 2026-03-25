import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AddToReadingList from '../components/books/AddToReadingList';
import { useState } from 'react';
import { useReviews } from '../hooks/useReviews';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewForm from '../components/reviews/ReviewForm';
import EditReviewModal from '../components/reviews/EditReviewModal';

export default function BookDetailPage() {
  const { id } = useParams();
  
  // Check id FIRST
  if (!id) {
    return (
      <div className="p-10 text-center">
        Invalid book ID
      </div>
    );
  }

  const { user } = useAuth();
  const { reviews, createReview, updateReview,likeReview, deleteReview, isCreating } = useReviews(id);
  const reviewsList = Array.isArray(reviews) ? reviews : [];
  const [editingReview, setEditingReview] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateReview = async (reviewId, updatedData) => {
    console.log('📝 Updating review:', { reviewId, updatedData });
    await updateReview({ reviewId, ...updatedData });
  };

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/books/${id}/`);
        return data;
      } catch (err) {
        console.error('Error fetching book:', err);
        throw err;
      }
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Book</h2>
          <p className="text-gray-600">{error.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h2>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Cover */}
          <div className="md:w-1/3">
            {book.cover_image ? (
              <img 
                src={book.cover_image} 
                alt={book.title} 
                className="w-full rounded-lg shadow"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No cover</span>
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 text-2xl mr-2">★</span>
              <span className="text-2xl font-semibold">
                {book.average_rating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-gray-500 ml-2">
                ({book.total_reviews || 0} reviews)
              </span>
            </div>

            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {book.genre}
              </span>
              <span className="ml-2 text-gray-600">{book.publication_year}</span>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>

            <div className="border-t pt-4 space-y-1">
              <p className="text-gray-600">
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Publisher:</span> {book.publisher || 'Unknown'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Pages:</span> {book.page_count || 'Unknown'}
              </p>
            </div>

            {/* Add to Reading List button - only for logged in users */}
            {user && (
              <div className="mt-6">
                <AddToReadingList bookId={book.id} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Reviews ({reviewsList.length})</h2>
        
        {/* Review Form */}
        <ReviewForm 
          onSubmit={createReview} 
          isSubmitting={isCreating}
          bookId={id}
        />
        
        {/* Reviews List */}
        <div className="space-y-4">
          {reviewsList.map(review => (
            <ReviewCard 
              key={review.id} 
              review={review}
              onEdit={(review) => {
                console.log('📚 Editing review:', review);
                setEditingReview(review);
                setIsEditModalOpen(true);
              }}
              onDelete={(reviewId) => {
                if (window.confirm('Delete this review?')) {
                  deleteReview(reviewId);
                }
              }}
              onLike={likeReview}
            />
          ))}
          
          {reviewsList.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No reviews yet. Be the first to review this book!
            </p>
          )}
        </div>
      </div>

      {/* Edit Review Modal */}
      <EditReviewModal 
        review={editingReview}
        isOpen={isEditModalOpen}
        onClose={() => {
          console.log('🔒 Closing edit modal');
          setIsEditModalOpen(false);
          setEditingReview(null);
        }}
        onSave={handleUpdateReview}
      />
    </div>
  );
}