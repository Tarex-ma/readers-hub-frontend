import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', password2: '',
    bio: '', reading_goal: 12, favorite_genres: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    const userData = {
      ...formData,
      reading_goal: parseInt(formData.reading_goal),
      favorite_genres: formData.favorite_genres.split(',').map(g => g.trim()).filter(g => g),
    };
    const success = await register(userData);
    if (success) navigate('/login');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Or <Link to="/login" className="text-blue-600 hover:underline">sign in to existing account</Link>
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username *" required
            value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full px-3 py-2 border rounded-md" />
          <input type="email" name="email" placeholder="Email *" required
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border rounded-md" />
          <input type="password" name="password" placeholder="Password *" required
            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border rounded-md" />
          <input type="password" name="password2" placeholder="Confirm Password *" required
            value={formData.password2} onChange={(e) => setFormData({...formData, password2: e.target.value})}
            className="w-full px-3 py-2 border rounded-md" />
          <textarea name="bio" placeholder="Bio (optional)" rows="2"
            value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full px-3 py-2 border rounded-md" />
          <input type="number" name="reading_goal" placeholder="Reading Goal (books/year)"
            value={formData.reading_goal} onChange={(e) => setFormData({...formData, reading_goal: e.target.value})}
            className="w-full px-3 py-2 border rounded-md" />
          <input type="text" name="favorite_genres" placeholder="Favorite Genres (comma separated)"
            value={formData.favorite_genres} onChange={(e) => setFormData({...formData, favorite_genres: e.target.value})}
            className="w-full px-3 py-2 border rounded-md" />
          <button type="submit" disabled={isLoading} className="w-full btn-primary py-2 disabled:opacity-50">
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
}