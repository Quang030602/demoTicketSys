import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logoutUserAPI } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUserAPI());
    navigate('/login'); // ✅ Chuyển về trang đăng nhập sau khi logout
  };
  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>

      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AiMier
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Support</Button>
        <Button color="inherit">Dashboard</Button>
        <Button variant="contained" color="secondary" sx={{ ml: 2 }} onClick={handleLogout}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;