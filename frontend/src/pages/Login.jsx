import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, { email, password });
      // Simpan token dan data user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal. Periksa kembali email/password.');
    }
  };

  return (
    <Box sx={{ bgcolor: '#0a0a0c', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: '#ffffff' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'center', fontFamily: 'Playfair Display' }}>
            ADMIN LOGIN
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 3, py: 1.5, bgcolor: '#0a0a0c', '&:hover': { bgcolor: '#222' } }}>
              Login
            </Button>
          </form>
          <Button fullWidth variant="text" sx={{ mt: 1, color: '#666' }} onClick={() => navigate('/forgot-password')}>
            Lupa Password?
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;