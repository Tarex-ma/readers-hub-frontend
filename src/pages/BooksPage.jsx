import { useState } from 'react';
import { useInfiniteBooks } from '../hooks/useInfiniteBooks';
import { useDebounce } from '../hooks/useDebounce';
import BookCard from '../components/books/BookCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function BooksPage() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const { data, fetchNextPage, hasNextPage, isLoading, isError } = useInfiniteBooks({ 
    search: debouncedSearch, 
    genre 
  });

  const books = data?.pages.flatMap(page => page.results) || [];
  const totalCount = data?.pages[0]?.count || 0;

  const genres = [
    { value: '', label: 'All Genres' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non_fiction', label: 'Non-Fiction' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'sci_fi', label: 'Science Fiction' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'romance', label: 'Romance' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Books</h1>
        <p className="text-gray-600">Find your next favorite read</p>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600"
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            <span>{showFilters ? 'Hide filters' : 'Show filters'}</span>
          </button>
          <p className="text-sm text-gray-500">{totalCount} books found</p>
        </div>

        {/* Simple Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {genres.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {isLoading && books.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-xl mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500">Something went wrong. Please try again.</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No books found. Try a different search.</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={books.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<div className="text-center py-8 text-gray-500">Loading more...</div>}
          endMessage={<p className="text-center text-gray-400 py-8">You've reached the end!</p>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}