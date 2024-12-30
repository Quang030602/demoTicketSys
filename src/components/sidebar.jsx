// File: components/Sidebar.js
import React from "react";
import { Drawer, Toolbar, Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";

const Sidebar = ({ onCreateTicketClick }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box", backgroundColor: "#fef4e8" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", padding: 2 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Ticket List
        </Typography>
        <List>
          <ListItem button>
            <ListItemText primary="Ticket History" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Open Tickets" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Close Tickets" />
          </ListItem>
        </List>
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 3, borderRadius: "10px", textTransform: "none" }}
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
