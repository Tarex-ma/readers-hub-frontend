import { Link } from 'react-router-dom';

export default function BookCard({ book }) {

  if (!book) return null;

  return (
    <Link to={book?.id ? `/books/${book.id}` : "#"} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {book.cover_image ? (
          <img src={book.cover_image} alt={book.title} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No cover</span>
          </div>
        )}

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-2">by {book.author}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm text-gray-600">
                {typeof book.average_rating === "number"
                  ? book.average_rating.toFixed(1)
                  : "0.0"} ({book.total_reviews || 0})
              </span>
            </div>

            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {book.genre}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}