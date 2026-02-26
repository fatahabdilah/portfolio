import React, { useState, useEffect } from 'react';
import { 
  Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, 
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, TextField, Dialog, 
  DialogActions, DialogContent, DialogTitle, Avatar, Chip, OutlinedInput, 
  MenuItem, Select, FormControl, InputLabel, Tooltip, Grid 
} from '@mui/material';
import { 
  Assignment as ProjectIcon, 
  Book as BlogIcon, 
  Settings as TechIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Add as AddIcon, 
  Logout as LogoutIcon,
  Link as LinkIcon
} from '@mui/icons-material'; // GitHubIcon dihapus
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminDashboard = () => {
  const [view, setView] = useState('projects'); 
  const [data, setData] = useState([]);
  const [techList, setTechList] = useState([]); 
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    file: null, 
    selectedTechs: [],
    name: '',
    demoUrl: '' // repoUrl dihapus
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.fatahabdilah.my.id/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
    fetchData();
    fetchTechs();
  }, [view, token]);

  const fetchData = async () => {
    try {
      const endpoint = view === 'technologies' ? 'technologies' : view;
      const res = await axios.get(`${API_URL}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.data || res.data || []);
    } catch (err) { 
      setData([]);
    }
  };

  const fetchTechs = async () => {
    try {
      const res = await axios.get(`${API_URL}/technologies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTechList(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

 // src/pages/AdminDashboard.jsx (Bagian handleSubmit)

const handleSubmit = async () => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    if (view === 'technologies') {
      const techData = { name: formData.name };
      if (editItem) {
        await axios.patch(`${API_URL}/technologies/${editItem._id}`, techData, config);
      } else {
        await axios.post(`${API_URL}/technologies`, techData, config);
      }
    } else {
      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);
      dataToSend.append('content', formData.content);
      
      if (view === 'projects') {
        // technologies dikirim sebagai string CSV
        dataToSend.append('technologies', formData.selectedTechs.join(','));
        dataToSend.append('demoUrl', formData.demoUrl);
        
        if (formData.file) {
          dataToSend.append('projectImage', formData.file); // Field name sesuai ProjectController
        }
      } else {
        if (formData.file) {
          dataToSend.append('thumbnail', formData.file); // Field name sesuai BlogController
        }
      }

      if (editItem) {
        await axios.patch(`${API_URL}/${view}/${editItem._id}`, dataToSend, config);
      } else {
        await axios.post(`${API_URL}/${view}`, dataToSend, config);
      }
    }

    setOpenModal(false);
    resetForm();
    fetchData();
  } catch (err) {
    // Menampilkan pesan error spesifik dari backend
    alert(err.response?.data?.error || "Gagal menyimpan data.");
  }
};

  const resetForm = () => {
    setFormData({ title: '', content: '', file: null, selectedTechs: [], name: '', demoUrl: '' });
    setEditItem(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus item ini?")) return;
    try {
      const endpoint = view === 'technologies' ? 'technologies' : view;
      await axios.delete(`${API_URL}/${endpoint}/${id}`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) { alert("Gagal menghapus."); }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: '#0a0a0c' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 700 }}>ADMIN PANEL</Typography>
          <IconButton onClick={handleLogout} color="inherit"><LogoutIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: drawerWidth, [`& .MuiDrawer-paper`]: { width: drawerWidth, bgcolor: '#f8f9fa' } }}>
        <Toolbar />
        <List>
          {[{ id: 'projects', label: 'Projects', icon: <ProjectIcon /> }, { id: 'blogs', label: 'Blogs', icon: <BlogIcon /> }, { id: 'technologies', label: 'Technologies', icon: <TechIcon /> }].map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => setView(item.id)} selected={view === item.id}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: '#f0f2f5' }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>{view} Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { resetForm(); setOpenModal(true); }} sx={{ bgcolor: '#0a0a0c' }}>
              Add {view.slice(0, -1)}
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#0a0a0c' }}>
                <TableRow>
                  {view !== 'technologies' && <TableCell sx={{ color: 'white' }}>Media</TableCell>}
                  <TableCell sx={{ color: 'white' }}>Main Info</TableCell>
                  {view === 'projects' && <TableCell sx={{ color: 'white' }}>Tech Stack</TableCell>}
                  {view === 'projects' && <TableCell sx={{ color: 'white' }}>Links</TableCell>}
                  <TableCell sx={{ color: 'white' }}>ID / Created At</TableCell>
                  <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? data.map((item) => (
                  <TableRow key={item._id} hover>
                    {view !== 'technologies' && (
                      <TableCell>
                        <Avatar variant="rounded" src={item.imageUrl || item.thumbnailUrl} sx={{ width: 60, height: 60, border: '1px solid #ddd' }} />
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.title || item.name}</Typography>
                      {item.content && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 300 }}>
                          {item.content}
                        </Typography>
                      )}
                    </TableCell>
                    {view === 'projects' && (
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {item.technologies?.map((t) => (
                            <Chip key={t._id} label={t.name} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </TableCell>
                    )}
                    {view === 'projects' && (
                      <TableCell>
                        {item.demoUrl && <Tooltip title="Live Demo"><IconButton size="small" href={item.demoUrl} target="_blank"><LinkIcon fontSize="small" /></IconButton></Tooltip>}
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled' }}>{item._id}</Typography>
                      <Typography variant="caption">{new Date(item.createdAt).toLocaleDateString('id-ID')}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => { 
                        setEditItem(item); 
                        setFormData({
                          title: item.title || '', 
                          content: item.content || '', 
                          name: item.name || '',
                          demoUrl: item.demoUrl || '',
                          selectedTechs: item.technologies?.map(t => t._id) || [] 
                        }); 
                        setOpenModal(true); 
                      }}>
                        <EditIcon color="primary" fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(item._id)}>
                        <DeleteIcon color="error" fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>No data found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700, bgcolor: '#f8f9fa' }}>{editItem ? 'Update' : 'Create New'} {view.slice(0, -1)}</DialogTitle>
        <DialogContent dividers>
          {view === 'technologies' ? (
            <TextField fullWidth label="Technology Name" margin="normal" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}><TextField fullWidth label="Title" variant="outlined" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Content / Description" multiline rows={6} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} /></Grid>
              {view === 'projects' && (
                <>
                  <Grid item xs={12}><TextField fullWidth label="Demo URL" value={formData.demoUrl} onChange={(e) => setFormData({...formData, demoUrl: e.target.value})} /></Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Technologies Stack</InputLabel>
                      <Select multiple value={formData.selectedTechs} onChange={(e) => setFormData({...formData, selectedTechs: e.target.value})} input={<OutlinedInput label="Technologies Stack" />} renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((val) => <Chip key={val} label={techList.find(t => t._id === val)?.name || val} size="small" />)}
                        </Box>
                      )}>
                        {techList.map((t) => <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>Upload Asset (Image/Thumbnail)</Typography>
                <input type="file" style={{ padding: '10px', border: '1px solid #ddd', width: '100%', borderRadius: '4px' }} onChange={(e) => setFormData({...formData, file: e.target.files[0]})} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Button onClick={() => setOpenModal(false)} variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#0a0a0c' }}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;