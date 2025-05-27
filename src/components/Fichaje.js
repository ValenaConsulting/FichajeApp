import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const Fichaje = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [fichajes, setFichajes] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [userName, setUserName] = useState('');
  const [totalDuration, setTotalDuration] = useState(0);
  const [activeSessionStart, setActiveSessionStart] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          withCredentials: true
        });
        setUserName(response.data.name);
      } catch (error) {
        if (error.response?.status === 401) {
          window.location.href = '/login';
        } else {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const calculateTotalDuration = () => {
    let total = totalDuration;
    if (isClockedIn && activeSessionStart) {
      const currentTime = new Date();
      const activeDuration = Math.floor((currentTime - activeSessionStart) / 1000);
      total += activeDuration;
    }
    return total;
  };

  const fetchTodayFichajes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fichajes/today', {
        withCredentials: true
      });
      if (response.data) {
        setFichajes(response.data.records);
        if (response.data.records.length > 0) {
          const lastRecord = response.data.records[response.data.records.length - 1];
          setIsClockedIn(lastRecord.type === 'entrada');
          if (lastRecord.type === 'entrada') {
            setActiveSessionStart(new Date(lastRecord.timestamp));
          }
        }
        setTotalDuration(response.data.totalDailyDuration || 0);
      }
    } catch (error) {
      console.error('Error fetching today\'s fichajes:', error);
    }
  };

  useEffect(() => {
    fetchTodayFichajes();
  }, []);

  const handleFichaje = async () => {
    const type = isClockedIn ? 'salida' : 'entrada';
    try {
      await axios.post('http://localhost:5000/api/fichajes', { type }, {
        withCredentials: true
      });
      setIsClockedIn(!isClockedIn);
      await fetchTodayFichajes();
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error('Error creating fichaje:', error);
      }
    }
  };

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTime());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isClockedIn) {
      const interval = setInterval(() => {
        setTotalDuration(prev => prev + 0);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isClockedIn]);

  return (
    <Box sx={{ 
      maxWidth: '1200px',
      margin: '3rem auto',
      padding: '1rem',
      textAlign: 'center',
      position: 'relative'
    }}>
      <LogoutButton />
      <Typography variant="h3" component="h1" mb={4}>
        Bienvenido a FichajeApp, {userName}
      </Typography>
      
      <Typography variant="h6" mb={2}>
        Hora actual: {currentTime}
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{ 
          backgroundColor: isClockedIn ? 'error.main' : 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: isClockedIn ? 'error.dark' : 'primary.dark'
          }
        }}
        onClick={handleFichaje}
      >
        {isClockedIn ? 'Fichar salida' : 'Fichar entrada'}
      </Button>

      <Typography variant="h6" mt={2}>
        Tiempo acumulado hoy: {formatDuration(calculateTotalDuration())}
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden', mt: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Concepto</TableCell>
                <TableCell>Hora</TableCell>
                {fichajes.some(f => f.duration) && <TableCell>Duración</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {fichajes.length > 0 ? (
                fichajes.map((fichaje, index) => (
                  <TableRow key={index}>
                    <TableCell>{fichaje.type === 'entrada' ? 'Entrada' : 'Salida'}</TableCell>
                    <TableCell>{new Date(fichaje.timestamp).toLocaleTimeString()}</TableCell>
                    {fichaje.duration && <TableCell>+{formatDuration(fichaje.duration)}</TableCell>}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No hay fichajes registrados hoy
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Fichaje;

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};