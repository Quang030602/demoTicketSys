// File: components/Sidebar.js
import React from "react";
import { Drawer, Toolbar, Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { blue, blueGrey, green, lightBlue, red } from "@mui/material/colors";

const Sidebar = ({ onCreateTicketClick, onFetchOpenTickets,onFetchClosedTickets,onFetchAllTickets }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: 240, 
          boxSizing: "border-box", 
          backgroundColor: (theme) => theme.palette.background.default 
        }
        
        
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", padding: 2}}>
        <Typography variant="h6" sx={{ mb: 2 ,color: lightBlue}}>
          Ticket List
        </Typography>
        <List sx={{  border: "1px solid transparent",borderRadius :2 ,transition: "border 0.3s", "&:hover": { border: "1px solid lightBlue" } }}>
          <ListItem button onClick={onFetchAllTickets} sx = {{borderRadius :'1px', "&:hover": { border: "1px solid green", borderRadius :2 }}}>
            <ListItemText primary="Tickets" />
          </ListItem>
          <ListItem button onClick={onFetchOpenTickets} sx = {{borderRadius :'1px', "&:hover": { border: "1px solid green", borderRadius :2 }}}>
            <ListItemText primary="Open Tickets" />
          </ListItem>

          <ListItem button onClick={onFetchClosedTickets} sx = {{borderRadius :'1px', "&:hover": { border: "1px solid green", borderRadius : 2 }}}>
            <ListItemText primary="Closed Tickets" />
          </ListItem>
        </List>
        <Button
          variant="contained"
          
          fullWidth
          sx={{ mt: 3, borderRadius: "10px", textTransform: "none",bg:blue }}
          onClick={onCreateTicketClick}
        >
          Create a Ticket
        </Button>
        <Typography variant="subtitle1" sx={{ mt: 3, color: "text.secondary" }}>
          Account Roll: <strong>Customer</strong>
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
