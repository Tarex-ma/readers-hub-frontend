import { Link } from 'react-router-dom';
import { BookOpenIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">Reader's Hub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your reading journey, discover new books, and connect with fellow book lovers.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/books" className="btn-primary px-6 py-3 text-lg">Browse Books</Link>
            <Link to="/register" className="btn-secondary px-6 py-3 text-lg">Join Now</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard 
            icon={<BookOpenIcon className="h-12 w-12 text-blue-600" />}
            title="Track Your Reading"
            description="Keep a personal reading list and track your progress through every book."
          />
          <FeatureCard 
            icon={<StarIcon className="h-12 w-12 text-blue-600" />}
            title="Write Reviews"
            description="Share your thoughts with ratings and detailed reviews for every book."
          />
          <FeatureCard 
            icon={<UserGroupIcon className="h-12 w-12 text-blue-600" />}
            title="Connect with Readers"
            description="Follow other readers and see what they're reading in your activity feed."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}