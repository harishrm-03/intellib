import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes/');
      setNotes(res.data);
    } catch (err) {
      setError('Failed to load notes');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create or Update Note
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        // Update
        await api.put(`/notes/${editingId}/`, { title, content });
      } else {
        // Create
        await api.post('/notes/', { title, content });
      }
      setTitle('');
      setContent('');
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      setError('Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  // Edit Note
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  // Delete Note
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}/`);
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Notes</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Create / Edit Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Note' : 'Create New Note'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter note title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Write your note here..."
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Note' : 'Add Note'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No notes yet. Create your first note above!
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-3">
                      Created: {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;