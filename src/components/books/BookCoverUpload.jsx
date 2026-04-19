import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function BookCoverUpload({ bookId, currentCover, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Previewgit commit -m "Update README with screenshots"
    setPreview(URL.createObjectURL(file));

    // Upload
    const formData = new FormData();
    formData.append('cover_image', file);

    setUploading(true);
    try {
      await api.put(`/books/${bookId}/upload-cover/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Cover uploaded successfully');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to upload cover');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Book Cover
      </label>
      
      <div className="flex items-start space-x-4">
        {/* Current/Preview cover */}
        <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : currentCover ? (
            <img src={currentCover} alt="Current cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PhotoIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Upload button */}
        <div className="flex-1">
          <input
            type="file"
            id="cover-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <label
            htmlFor="cover-upload"
            className={`inline-block px-4 py-2 border rounded-md cursor-pointer ${
              uploading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {uploading ? 'Uploading...' : 'Choose Image'}
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Recommended: Square image, at least 300x300 pixels
          </p>
        </div>
      </div>
    </div>
  );
}