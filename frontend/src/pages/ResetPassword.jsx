import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Mengambil token dari URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validasi kecocokan password di sisi client
    if (password !== confirmPassword) {
      return setError('Password tidak cocok.');
    }

    if (password.length < 6) {
      return setError('Password minimal harus 6 karakter.');
    }

    setLoading(true);
    try {
      // Endpoint PATCH sesuai dengan UserController.js
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/users/resetpassword/${token}`, {
        password: password
      });

      setMessage(res.data.message);
      
      // Arahkan ke login setelah 3 detik jika berhasil
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mereset password. Token mungkin kadaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#0a0a0c', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, textAlign: 'center', fontFamily: 'Playfair Display' }}>
            PASSWORD BARU
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
            Silakan masukkan password baru untuk akun Anda.
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message} Mengalihkan ke login...</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Password Baru"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Konfirmasi Password"
              type="password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ 
                mt: 3, 
                py: 1.5, 
                bgcolor: '#0a0a0c', 
                '&:hover': { bgcolor: '#222' } 
              }}
            >
              {loading ? 'Memproses...' : 'Update Password'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;