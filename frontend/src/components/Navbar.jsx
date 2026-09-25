import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">IntelliTask</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Dashboard
            </Link>
            <Link
              to="/notes"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Notes
            </Link>
            <Link
              to="/chat"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              AI Chat
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;