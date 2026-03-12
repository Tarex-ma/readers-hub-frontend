import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpenIcon, HeartIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { name: 'Books Read', value: user?.reading_list_stats?.read || 0, icon: BookOpenIcon },
    { name: 'Currently Reading', value: user?.reading_list_stats?.currently_reading || 0, icon: ClockIcon },
    { name: 'Reviews Written', value: user?.reviews_count || 0, icon: HeartIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.username}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="h-12 w-12 text-blue-100" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/books" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100">
              <span className="font-medium">📚 Browse Books</span>
              <p className="text-sm text-gray-600">Discover your next read</p>
            </Link>
            <Link to="/reading-list" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100">
              <span className="font-medium">📖 My Reading List</span>
              <p className="text-sm text-gray-600">Track your reading progress</p>
            </Link>
            <Link to={`/profile/${user?.id}`} className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100">
              <span className="font-medium">👤 My Profile</span>
              <p className="text-sm text-gray-600">View and edit your profile</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Reading Goal</h2>
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {user?.reading_list_stats?.read || 0}/{user?.reading_goal || 12}
            </div>
            <p className="text-gray-600 mb-4">books read this year</p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 rounded-full h-4"
                style={{ width: `${Math.min(100, ((user?.reading_list_stats?.read || 0) / (user?.reading_goal || 12)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}