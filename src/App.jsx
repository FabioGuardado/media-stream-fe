import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import MediaDetail from './pages/MediaDetail';
import MediaManager from './pages/admin/MediaManager';

export default function App() {
  return (
    <div className="min-h-screen bg-surface font-body">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/media/:id"
          element={
            <ProtectedRoute>
              <MediaDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/media"
          element={
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <MediaManager />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
