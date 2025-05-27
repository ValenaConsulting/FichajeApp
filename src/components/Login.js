import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        navigate('/fichaje');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        
        if (error.response.status === 401) {
          if (error.response.data?.message) {
            toast.error(error.response.data.message);
          } else if (error.response.data?.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error('Invalid email or password');
          }
        } else {
          toast.error(`Login failed: ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        console.log('Request:', error.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        console.log('Error config:', error.config);
        toast.error('Login failed. Please try again.');
      }
    }
  };

  const handleSendTestEmail = async () => {
    try {
      await axios.post('http://localhost:5000/api/email/test-email');
      alert('Test email sent successfully');
    } catch (error) {
      alert('Failed to send test email');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={10} sx={{ padding: 4, maxWidth: 400 }} square={false}>
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ marginTop: 2 }}
          >
            Ingresar
          </Button>
          <Button
            component={Link}
            to="/email"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
          >
            Recuperar contraseña
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;