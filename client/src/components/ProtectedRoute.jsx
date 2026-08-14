// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;
  return token ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;