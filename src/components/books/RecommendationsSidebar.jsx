import { useRecommendations } from '../../hooks/useRecommendations';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

export default function RecommendationsSidebar() {
  const { data: recommendations, isLoading } = useRecommendations(5);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Recommended for You</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Recommended for You</h2>
      <div className="space-y-3">
        {recommendations.map(book => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="block hover:bg-gray-50 rounded-lg p-2 transition"
          >
            <div className="flex items-start space-x-2">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-12 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">No cover</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                <p className="text-xs text-gray-600">by {book.author}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500 text-xs">★</span>
                  <span className="text-xs text-gray-500 ml-1">
                    {book.average_rating?.toFixed(1)} ({book.total_reviews})
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}