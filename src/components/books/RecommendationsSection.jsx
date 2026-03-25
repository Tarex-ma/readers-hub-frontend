import { useRecommendations } from '../../hooks/useRecommendations';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export default function RecommendationsSection({ limit = 5, title = "Recommended for You" }) {
  const { data: recommendations, isLoading, error } = useRecommendations(limit);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-3">
              <div className="w-12 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-red-500 text-sm">Failed to load recommendations</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="text-center py-6">
          <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-2">No recommendations yet</p>
          <p className="text-gray-400 text-xs">
            Add books to your reading list and rate them to get personalized recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {recommendations.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {/* Book Cover */}
            <div className="w-12 h-16 flex-shrink-0">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">No cover</span>
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{book.title}</h3>
              <p className="text-sm text-gray-600 truncate">by {book.author}</p>
              
              {/* Rating */}
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.round(book.average_rating || 0) 
                        ? 'text-yellow-500 text-xs' 
                        : 'text-gray-300 text-xs'
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({book.total_reviews || 0})
                </span>
              </div>

              {/* Genre Tag */}
              <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {book.genre}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* View More Link */}
      {recommendations.length >= limit && (
        <div className="mt-4 text-center">
          <Link
            to="/recommendations"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            View all recommendations →
          </Link>
        </div>
      )}
    </div>
  );
}