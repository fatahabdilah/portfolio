import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Alert } from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/forgot-password`, { email });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Terjadi kesalahan.');
    }
  };

  return (
    <Box sx={{ bgcolor: '#0a0a0c', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>Reset Password</Typography>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Masukkan Email Admin" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2, bgcolor: '#0a0a0c' }}>Kirim Link Reset</Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;