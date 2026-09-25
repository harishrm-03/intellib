import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function Chat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  // Load previous chat history
  const fetchHistory = async () => {
    try {
      const res = await api.get('/history/');
      setChatHistory(res.data.reverse()); // oldest first
    } catch (err) {
      console.log('Failed to load history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Send message to AI
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setLoading(true);
    setError('');

    // Optimistically show user message
    setChatHistory((prev) => [
      ...prev,
      { id: Date.now(), message: userMessage, response: null, isTemp: true },
    ]);

    try {
      const res = await api.post('/chat/', { message: userMessage });

      // Replace temp message with real response
      setChatHistory((prev) => {
        const filtered = prev.filter((item) => !item.isTemp);
        return [...filtered, res.data];
      });
    } catch (err) {
      setError('Failed to get AI response. Please try again.');
      // Remove temp message on error
      setChatHistory((prev) => prev.filter((item) => !item.isTemp));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Assistant</h1>
        <p className="text-gray-500 text-sm mb-6">
          Powered by Groq (Llama 3) — Ask me anything!
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border p-4 overflow-y-auto mb-4 min-h-[400px] max-h-[60vh]">
          {chatHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              Start a conversation with the AI...
            </div>
          ) : (
            <div className="space-y-6">
              {chatHistory.map((chat) => (
                <div key={chat.id} className="space-y-3">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%]">
                      {chat.message}
                    </div>
                  </div>

                  {/* AI Response */}
                  {chat.response ? (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[80%] whitespace-pre-wrap">
                        {chat.response}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-2xl rounded-bl-md">
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Box */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;