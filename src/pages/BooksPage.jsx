import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/books/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function BooksPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, error } = useBooks({ search });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error?.message || 'Failed to load books'} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Books</h1>
      
      <input
        type="text"
        placeholder="Search by title, author, or ISBN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 border rounded-lg mb-8 focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.results?.map(book => <BookCard key={book.id} book={book} />)}
      </div>

      {data?.results?.length === 0 && (
        <p className="text-center text-gray-500 py-8">No books found.</p>
      )}
    </div>
  );
}