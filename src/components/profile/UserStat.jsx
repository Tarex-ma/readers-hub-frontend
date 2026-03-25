import { useUserStats } from '../../hooks/useUsers';
import { BookOpenIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function UserStats({ userId }) {
  const { data: stats, isLoading } = useUserStats(userId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: 'Books Read',
      value: stats?.books_read_count || 0,
      icon: BookOpenIcon,
      color: 'text-blue-600'
    },
    {
      label: 'Reviews Written',
      value: stats?.reviews_count || 0,
      icon: StarIcon,
      color: 'text-yellow-600'
    },
    {
      label: 'Followers',
      value: stats?.followers_count || 0,
      icon: UserGroupIcon,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <item.icon className={`h-8 w-8 ${item.color} opacity-75`} />
          </div>
        </div>
      ))}
    </div>
  );
}