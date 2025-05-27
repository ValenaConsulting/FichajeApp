import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleLogout}
      sx={{ position: 'absolute', top: 20, right: 20 }}
    >
      Cerrar Sesión
    </Button>
  );
};

export default LogoutButton;