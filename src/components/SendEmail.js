import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SendEmail = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert('Correo de recuperación enviado. Por favor revisa tu bandeja de entrada.');
      navigate('/login');
    } catch (error) {
      alert('Error al enviar el correo de recuperación');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Recuperación de Contraseña
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSendEmail}
          sx={{ marginTop: 2 }}
        >
          Enviar email de recuperación
        </Button>
      </Paper>
    </Box>
  );
};

export default SendEmail;