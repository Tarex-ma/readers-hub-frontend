import { useReadingList } from '../hooks/useReadingList';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ReadingListPage() {
  const { readingList, isLoading, updateStatus, removeFromList } = useReadingList();

  if (isLoading) return <LoadingSpinner />;

  const statusGroups = {
    want_to_read: [],
    currently_reading: [],
    read: [],
    did_not_finish: []
  };

  readingList?.forEach(item => {
    if (statusGroups[item.status]) {
      statusGroups[item.status].push(item);
    }
  });

  const statusTitles = {
    want_to_read: 'Want to Read',
    currently_reading: 'Currently Reading',
    read: 'Read',
    did_not_finish: 'Did Not Finish'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Reading List</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(statusGroups).map(([status, items]) => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-4 capitalize">
              {statusTitles[status]} ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow p-3">
                  <Link to={`/books/${item.book}`} className="font-medium hover:text-blue-600">
                    {item.book_details?.title}
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">by {item.book_details?.author}</p>
                  
                  {item.status === 'currently_reading' && item.current_page > 0 && (
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-1">
                        Page {item.current_page} of {item.book_details?.page_count || '?'}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 rounded-full h-1.5"
                          style={{ width: `${(item.current_page / (item.book_details?.page_count || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <select
                    value={item.status}
                    onChange={(e) => updateStatus({ id: item.id, status: e.target.value })}
                    className="w-full text-sm border rounded px-2 py-1 mb-2"
                  >
                    {Object.entries(statusTitles).map(([key, title]) => (
                      <option key={key} value={key}>{title}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromList(item.id)}
                    className="text-xs text-red-600 hover:text-red-800 w-full text-center"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No books</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}