import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" />;

  return children;
};

export default RoleProtectedRoute;
