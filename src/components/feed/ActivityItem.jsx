import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  StarIcon, 
  BookmarkIcon, 
  UserPlusIcon, 
  HeartIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const activityIcons = {
  review: StarIcon,
  reading_list: BookmarkIcon,
  follow: UserPlusIcon,
  like: HeartIcon,
  book: BookOpenIcon
};

const activityColors = {
  review: 'text-yellow-500',
  reading_list: 'text-green-500',
  follow: 'text-blue-500',
  like: 'text-red-500',
  book: 'text-purple-500'
};

const activityMessages = {
  review: (activity) => {
    const bookTitle = activity.metadata?.book_title || 'a book';
    const rating = activity.metadata?.rating ? ` with ${activity.metadata.rating} stars` : '';
    return (
      <>
        reviewed <span className="font-medium">{bookTitle}</span>{rating}
      </>
    );
  },
  reading_list: (activity) => {
    const bookTitle = activity.metadata?.book_title || 'a book';
    const status = activity.metadata?.status?.replace('_', ' ') || 'added';
    return (
      <>
        added <span className="font-medium">{bookTitle}</span> to{' '}
        <span className="capitalize">{status}</span>
      </>
    );
  },
  follow: (activity) => {
    const followedUser = activity.metadata?.followed_username || 'someone';
    return (
      <>started following <span className="font-medium">{followedUser}</span></>
    );
  },
  like: (activity) => (
    <>liked a review</>
  ),
  book: (activity) => {
    const bookTitle = activity.metadata?.book_title || 'a book';
    return (
      <>interacted with <span className="font-medium">{bookTitle}</span></>
    );
  }
};

export default function ActivityItem({ activity }) {
  const Icon = activityIcons[activity.activity_type] || BookOpenIcon;
  const colorClass = activityColors[activity.activity_type] || 'text-gray-500';
  const message = activityMessages[activity.activity_type]?.(activity) || 'performed an action';

  return (
    <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100">
      {/* Icon */}
      <div className={`p-2 rounded-full bg-gray-50 ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <Link 
            to={`/profile/${activity.user}`} 
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {activity.user_details?.username}
          </Link>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
          {message}
        </p>
        
        {/* Optional: Show additional metadata */}
        {activity.metadata?.book_cover && (
          <div className="mt-2 flex items-center space-x-2">
            <img 
              src={activity.metadata.book_cover} 
              alt="Book cover" 
              className="w-8 h-10 object-cover rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}