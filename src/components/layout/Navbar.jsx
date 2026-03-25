import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpenIcon, 
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon // Add this import
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
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

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/books" className="nav-link">
              Books
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/reading-list" className="nav-link">
                  Reading List
                </Link>
                <Link to="/feed" className="nav-link">
                  Feed
                </Link>
                {/* ADD DISCOVER LINK HERE - FIXED */}
                <Link to="/users" className="nav-link flex items-center space-x-1">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>Discover</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop User Menu - Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Profile Link */}
                <Link 
                  to={`/profile/${user?.id}`} 
                  className="flex items-center space-x-2 nav-link"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {user?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:inline">{user?.username}</span>
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              /* Show Login/Signup ONLY when NOT authenticated */
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
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
              {/* Mobile Links */}
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
                    Reading List
                  </Link>
                  <Link 
                    to="/feed" 
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Feed
                  </Link>
                  {/* FIXED: Remove the duplicate and keep this one */}
                  <Link 
                    to="/users" 
                    className="mobile-nav-link flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserGroupIcon className="h-4 w-4" />
                    <span>Discover</span>
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
                /* Mobile Login/Signup - only when NOT authenticated */
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