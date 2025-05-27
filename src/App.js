import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserManagement from './components/UserManagement';
import Fichaje from './components/Fichaje';
import Login from './components/Login';
import { useEffect } from 'react';
import axios from 'axios';
import Logout from './components/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import SendEmail from './components/SendEmail';
import ResetPassword from './components/ResetPassword';

function App() {
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Skip session check for login and reset password routes
        if (window.location.pathname === '/login' || 
            window.location.pathname.startsWith('/reset-password')) {
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/auth/check-session', {
          withCredentials: true
        });
        
        if (response.data.redirect && window.location.pathname !== response.data.redirect) {
          window.location.href = response.data.redirect;
        }
      } catch (error) {
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    };
    checkSession();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/fichaje" element={
          <ProtectedRoute>
            <Fichaje />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute adminOnly={true}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/email" element={<SendEmail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
