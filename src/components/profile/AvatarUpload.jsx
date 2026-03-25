import { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AvatarUpload({ onClose }) {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { fetchUser } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    setUploading(true);
    try {
      await api.put('/accounts/profile/avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchUser();
      toast.success('Avatar updated!');
      onClose();
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Update Avatar</h2>
        
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100">
                <span className="text-3xl text-blue-600">📷</span>
              </div>
            )}
          </div>

          <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
            Choose Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!avatar || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}