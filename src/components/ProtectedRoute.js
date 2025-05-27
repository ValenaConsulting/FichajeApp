import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthorized, setIsAuthorized] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          withCredentials: true
        });
        
        if (response.data.redirect) {
          setIsAuthorized(false);
        } else if (adminOnly && response.data.role !== 'Administrador') {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, [adminOnly]);

  if (isAuthorized === null) {
    return null;
  }

  return isAuthorized ? children : <Navigate to="/fichaje" />;
};

export default ProtectedRoute;