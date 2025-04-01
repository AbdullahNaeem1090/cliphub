
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  console.log("ok chechked")

  return isAuthenticated ? element : <Navigate to="/logIn" />;
};

export default ProtectedRoute;


