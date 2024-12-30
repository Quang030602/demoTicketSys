import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="fixed" color="default" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AiMier
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Support</Button>
        <Button color="inherit">Dashboard</Button>
        <Button variant="contained" color="error" sx={{ ml: 2 }}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;