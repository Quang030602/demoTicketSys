// File: components/Sidebar.js
import { Box, Button, Drawer, List, ListItem, ListItemText, Toolbar, Typography } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import React from "react";

const Sidebar = ({ onCreateTicketClick, setFilterStatus , filterStatus, user }) => {
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
      <Box sx={{ overflow: "auto", padding: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: lightBlue }}>
          Ticket List
        </Typography>
        <List>
          <ListItem 
            button 
            onClick={() => setFilterStatus("all")}
            sx={{
              borderRadius: 1, 
              backgroundColor: filterStatus === "all" ? lightBlue[200] : "transparent",
              "&:hover": { backgroundColor: lightBlue[100] }
            }}
          >
            <ListItemText primary="Tickets" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => setFilterStatus("open")}
            sx={{
              borderRadius: 1, 
              backgroundColor: filterStatus === "open" ? lightBlue[200] : "transparent",
              "&:hover": { backgroundColor: lightBlue[100] }
            }}
          >
            <ListItemText primary="Open Tickets" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => setFilterStatus("closed")}
            sx={{
              borderRadius: 1, 
              backgroundColor: filterStatus === "closed" ? lightBlue[200] : "transparent",
              "&:hover": { backgroundColor: lightBlue[100] }
            }}
          >
            <ListItemText primary="Closed Tickets" />
          </ListItem>
        </List>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, borderRadius: "10px", textTransform: "none", backgroundColor: lightBlue }}
          onClick={onCreateTicketClick}
        >
          Create a Ticket
        </Button>
        <Typography variant="subtitle1" sx={{ mt: 3, color: "text.secondary" }}>
          Account Role: <strong>{user || "Role not available"}</strong>
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
