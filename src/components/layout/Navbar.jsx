import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpenIcon, 
  HomeIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Reader's Hub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/books" className="nav-link">Books</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/reading-list" className="nav-link">My Reading List</Link>
              </>
            )}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={`/profile/${user?.id}`} className="flex items-center space-x-2 nav-link">
                  <UserIcon className="h-5 w-5" />
                  <span>{user?.username}</span>
                </Link>
                <button onClick={handleLogout} className="nav-link text-red-600 hover:text-red-800">
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/books" 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Books
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/reading-list" 
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Reading List
                  </Link>
                  <Link 
                    to={`/profile/${user?.id}`} 
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile ({user?.username})
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="mobile-nav-link text-red-600 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="mobile-nav-link bg-blue-600 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}