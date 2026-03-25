import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpenIcon, HeartIcon, ClockIcon } from '@heroicons/react/24/outline';
import RecommendationsSection from '../components/books/RecommendationsSection';

export default function DashboardPage() {
  const { user } = useAuth();

  // Get stats from user object
  const booksRead = user?.reading_list_stats?.read || 0;
  const currentlyReading = user?.reading_list_stats?.currently_reading || 0;
  const reviewsWritten = user?.reviews_count || 0;
  const readingGoal = user?.reading_goal || 12;

  const stats = [
    { name: 'Books Read', value: booksRead, icon: BookOpenIcon },
    { name: 'Currently Reading', value: currentlyReading, icon: ClockIcon },
    { name: 'Reviews Written', value: reviewsWritten, icon: HeartIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.username}!</h1>

      {/* Stats Cards */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/books" className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="font-medium text-blue-700">📚 Browse Books</span>
                <p className="text-xs text-gray-600 mt-1">Discover your next read</p>
              </Link>
              <Link to="/reading-list" className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="font-medium text-green-700">📖 Reading List</span>
                <p className="text-xs text-gray-600 mt-1">Track your progress</p>
              </Link>
              <Link to="/feed" className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="font-medium text-purple-700">📊 Activity Feed</span>
                <p className="text-xs text-gray-600 mt-1">See what friends are reading</p>
              </Link>
              <Link to={`/profile/${user?.id}`} className="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <span className="font-medium text-orange-700">👤 My Profile</span>
                <p className="text-xs text-gray-600 mt-1">View and edit profile</p>
              </Link>
              <Link to="/users" className="p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                <span className="font-medium text-pink-700">👥 Discover Readers</span>
                <p className="text-xs text-gray-600 mt-1">Find and follow other book lovers</p>
              </Link>
            </div>
          </div>

          {/* Reading Goal Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Reading Goal</h2>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {booksRead}/{readingGoal}
              </div>
              <p className="text-gray-600 mb-4">books read this year</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 rounded-full h-4 transition-all duration-300"
                  style={{ width: `${Math.min(100, (booksRead / readingGoal) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Recommendations */}
        <div className="lg:col-span-1">
          <RecommendationsSection limit={5} />
        </div>
      </div>
    </div>
  );
}