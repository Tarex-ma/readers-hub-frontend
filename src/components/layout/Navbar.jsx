import { Link } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Reader's Hub</span>
            </Link>
            <Link to="/books" className="nav-link">Books</Link>
          </div>

          {/* Simple auth buttons (just for display on Day 3) */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}