import { useState } from 'react';
import { useReadingList } from '../../hooks/useReadingList';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

export default function AddToReadingList({ bookId }) {
  const [isOpen, setIsOpen] = useState(false);
  const { readingList, addToReadingList, isAdding } = useReadingList();

  // Safely check if book exists in reading list
  const existingEntry = readingList?.find(item => item?.book === bookId);
  
  const statusOptions = [
    { value: 'want_to_read', label: 'Want to Read' },
    { value: 'currently_reading', label: 'Currently Reading' },
    { value: 'read', label: 'Read' },
    { value: 'did_not_finish', label: 'Did Not Finish' }
  ];

  if (existingEntry) {
    const statusLabel = statusOptions.find(s => s.value === existingEntry.status)?.label;
    return (
      <div className="inline-block">
        <span className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-md">
          <BookmarkIconSolid className="h-5 w-5 mr-2" />
          In your {statusLabel || 'list'}
        </span>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <BookmarkIcon className="h-5 w-5 mr-2" />
        Add to List
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  addToReadingList({ bookId, status: option.value });
                  setIsOpen(false);
                }}
                disabled={isAdding}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}