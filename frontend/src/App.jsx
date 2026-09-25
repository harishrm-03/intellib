import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Chat from './pages/Chat';

function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!token ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/notes"
        element={token ? <Notes /> : <Navigate to="/login" />}
      />
      <Route
        path="/chat"
        element={token ? <Chat /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;