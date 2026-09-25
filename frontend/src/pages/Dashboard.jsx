import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome to IntelliTask – AI Powered Task Manager</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Notes Card */}
          <Link
            to="/notes"
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-6"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">My Notes</h2>
            <p className="text-gray-500 text-sm">
              Create, edit and manage your personal notes and tasks.
            </p>
          </Link>

          {/* AI Chat Card */}
          <Link
            to="/chat"
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-6"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">AI Assistant</h2>
            <p className="text-gray-500 text-sm">
              Chat with AI powered by Groq (Llama 3) for instant help.
            </p>
          </Link>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Account</h2>
            <p className="text-gray-500 text-sm">
              You are successfully logged in. More profile features coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;