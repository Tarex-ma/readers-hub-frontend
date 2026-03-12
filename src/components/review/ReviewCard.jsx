import { format } from 'date-fns';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {review.user_details?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <span className="font-semibold">{review.user_details?.username}</span>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      </div>
      
      {review.spoiler && (
        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mb-2">
          ⚠️ Contains Spoilers
        </span>
      )}
      
      <p className="text-gray-700 mb-2">{review.text}</p>
      
      <div className="text-sm text-gray-500">
        Read on {format(new Date(review.date_read), 'MMMM d, yyyy')}
      </div>
    </div>
  );
}