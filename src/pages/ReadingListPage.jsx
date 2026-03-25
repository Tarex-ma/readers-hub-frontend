import { useReadingList } from '../hooks/useReadingList';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ReadingListPage() {
  const { 
    readingList, 
    isLoading, 
    updateStatus, 
    updateProgress, 
    removeFromList,
    isUpdating 
  } = useReadingList();
  
  const [progressInputs, setProgressInputs] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log('Rendering with readingList:', readingList);

  // Group books by status
  const statusGroups = {
    want_to_read: [],
    currently_reading: [],
    read: [],
    did_not_finish: []
  };

  if (Array.isArray(readingList)) {
    readingList.forEach(item => {
      if (item && item.status && statusGroups.hasOwnProperty(item.status)) {
        statusGroups[item.status].push(item);
      }
    });
  }

  const statusTitles = {
    want_to_read: 'Want to Read',
    currently_reading: 'Currently Reading',
    read: 'Read',
    did_not_finish: 'Did Not Finish'
  };

  const statusColors = {
    want_to_read: 'bg-blue-50',
    currently_reading: 'bg-green-50',
    read: 'bg-purple-50',
    did_not_finish: 'bg-gray-50'
  };

  const handleProgressUpdate = async (id, currentPage, totalPages) => {
    if (currentPage < 0) currentPage = 0;
    if (currentPage > totalPages) currentPage = totalPages;
    
    setUpdatingId(id);
    try {
      await updateProgress({ id, currentPage });
      toast.success('Progress updated!');
      setProgressInputs(prev => ({ ...prev, [id]: '' }));
    } catch (error) {
      toast.error('Failed to update progress');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Reading List</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(statusGroups).map(([status, items]) => (
          <div key={status} className={`${statusColors[status]} rounded-lg p-4 min-h-[400px]`}>
            <h2 className="font-semibold text-lg mb-4 flex justify-between items-center">
              <span>{statusTitles[status]}</span>
              <span className="bg-white px-2 py-1 rounded-full text-sm">
                {items.length}
              </span>
            </h2>
            
            <div className="space-y-4">
              {items.map(item => {
                // Get book details safely
                const bookDetails = item.book_details || {};
                const pageCount = bookDetails.page_count;
                const hasPageCount = pageCount && pageCount > 0;
                
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow p-4">
                    {/* Book Info */}
                    <Link 
                      to={`/books/${item.book}`} 
                      className="font-medium hover:text-blue-600 block"
                    >
                      {bookDetails.title || 'Unknown Title'}
                    </Link>
                    <p className="text-sm text-gray-600 mb-3">
                      by {bookDetails.author || 'Unknown Author'}
                    </p>
                    
                    {/* Progress Section - Only for Currently Reading */}
                    {item.status === 'currently_reading' && (
                      <div className="mb-4">
                        {hasPageCount ? (
                          <>
                            {/* Progress Bar */}
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>
                                {item.current_page || 0} / {pageCount} pages
                                {item.current_page ? ` (${Math.round((item.current_page / pageCount) * 100)}%)` : ''}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                              <div 
                                className="bg-blue-600 rounded-full h-2.5 transition-all duration-300"
                                style={{ 
                                  width: `${item.current_page ? (item.current_page / pageCount) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                            
                            {/* Page Input */}
                            <div className="flex space-x-2">
                              <input
  type="number"
  min="0"
  max={pageCount}
  value={progressInputs[item.id] ?? item.current_page ?? ''}
  onChange={(e) =>
    setProgressInputs(prev => ({
      ...prev,
      [item.id]: Number(e.target.value)
    }))
  }
  placeholder="Page #"
  className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
/>
                              <input
                                type="number"
                                min="0"
                                max={pageCount}
                                value={progressInputs[item.id] ?? item.current_page ?? ''}
                                onChange={(e) => setProgressInputs({
                                  ...progressInputs,
                                  [item.id]: e.target.value
                                })}
                                placeholder="Page #"
                                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => {
                                  const page = parseInt(progressInputs[item.id]);
                                  if (isNaN(page)) {
                                    toast.error('Please enter a valid page number');
                                    return;
                                  }
                                  handleProgressUpdate(
                                    item.id, 
                                    page, 
                                    pageCount
                                  );
                                }}
                                disabled={updatingId === item.id}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                              >
                                {updatingId === item.id ? 'Updating...' : 'Update'}
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-yellow-600 mb-3">
                            No page count available for this book
                          </p>
                        )}
                      </div>
                    )}

                    {/* Status Dropdown */}
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus({ id: item.id, status: e.target.value })}
                      disabled={isUpdating}
                      className="w-full text-sm border rounded-lg px-3 py-2 mb-3 bg-white"
                    >
                      {Object.entries(statusTitles).map(([key, title]) => (
                        <option key={key} value={key}>{title}</option>
                      ))}
                    </select>

                    {/* Remove Button */}
                    <button
                      onClick={() => {
                        if (window.confirm('Remove this book from your reading list?')) {
                          removeFromList(item.id);
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-800 w-full text-center"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
              
              {/* Empty State */}
              {items.length === 0 && (
                <div className="bg-white bg-opacity-50 rounded-lg p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">No books</p>
                  {status === 'want_to_read' && (
                    <Link 
                      to="/books" 
                      className="text-xs text-blue-600 hover:underline inline-block"
                    >
                      Browse books →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}