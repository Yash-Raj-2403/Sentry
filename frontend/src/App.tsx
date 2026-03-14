import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Agents from './pages/Agents';
import Reports from './pages/Reports';
import Network from './pages/Network';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — redirect to /login when signed out */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
        <Route path="/agents"    element={<ProtectedRoute><Agents /></ProtectedRoute>} />
        <Route path="/reports"   element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/network"   element={<ProtectedRoute><Network /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
