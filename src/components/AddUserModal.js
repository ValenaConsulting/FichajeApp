import React, { useState } from 'react';
import { Modal, Box, TextField, MenuItem, FormControlLabel, Radio, RadioGroup, Button, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const AddUserModal = ({ open, handleClose, refreshUsers }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        ...formData,
        password: formData.password
      });
      if (response.status === 201) {
        refreshUsers();
        handleClose();
        toast.success('User added successfully!');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response) {
        if (error.response.data?.code === 11000) {
          if (error.response.data?.keyPattern?.email) {
            toast.error(`Email "${error.response.data.keyValue.email}" is already registered. Please use a different email address.`);
          } else if (error.response.data?.keyPattern?.username) {
            toast.error(`Username "${error.response.data.keyValue.username}" is already in use. Please choose a different username.`);
          }
        } else if (error.response.status === 400) {
          toast.error('Invalid data. Please check all fields and try again.');
        } else {
          toast.error('Error creating user. Please try again later.');
        }
      } else {
        toast.error('Network error. Please check your connection and try again.');
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          Add New User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="Empleado">Empleado</MenuItem>
            <MenuItem value="Supervisor">Supervisor</MenuItem>
            <MenuItem value="RRHH">RRHH</MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
          </TextField>
          <RadioGroup
            name="status"
            value={formData.status}
            onChange={handleChange}
            row
            sx={{ mt: 2 }}
          >
            <FormControlLabel value="active" control={<Radio />} label="Active" />
            <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
          </RadioGroup>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Add User
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddUserModal;