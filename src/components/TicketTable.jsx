// File: components/TicketTable.jsx
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField, InputAdornment, Pagination, Box, IconButton, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const truncateText = (text, maxLength) => {
  return text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const TicketTable = ({ onViewClick, onDeleteClick, onEditClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalTickets, setTotalTickets] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);

  const fetchTickets = async () => {
    try {
      const url = searchTerm
        ? `http://localhost:4953/v1/tickets?search=${searchTerm}`
        : `http://localhost:4953/v1/tickets`;
      
      const response = await fetch(url);
      const data = await response.json();
      setTickets(Array.isArray(data) ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage) : []);
      setTotalTickets(data.length || 0);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, page, rowsPerPage]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleMenuClick = (event, ticket) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTicket(ticket);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTicket(null);
  };
  const handleStatusMenuClick = (event, ticket) => {
    setStatusAnchor(event.currentTarget);
    setSelectedTicket(ticket);
  };

  const handleStatusChange = async (status) => {
    if (!selectedTicket) return;
    try {
      console.log("selected ticket ",selectedTicket )
      const response = await fetch(`http://localhost:4953/v1/tickets/${selectedTicket._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === selectedTicket._id ? { ...ticket, status } : ticket
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
    setStatusAnchor(null);
  };
  return (
    <TableContainer component={Paper}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Tickets
        </Typography>
        <TextField 
          id="outlined-search" 
          label="Search..." 
          type="text" 
          size='small' 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset page to 1 when search input changes
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 1 }}>
                <SearchIcon sx={{color:'black'}}/>
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <CloseIcon 
                  fontSize='small'
                  sx={{color: 'black', cursor:'pointer'}}
                  onClick={() => {
                    setSearchTerm('');
                    setPage(1);
                  }}
                />
              </InputAdornment>
            ) : null
          }}
          sx={{
            minWidth:'250px',
            maxWidth:'350px',
            backgroundColor: 'white',
            borderRadius: '5px',
            
            m:1,
            '& label':{
              color:'black',
            },
            '& label.Mui-focused':{
              color:'black',
            },
            '& input':{
              color:'black',
              padding: '10px 14px',
            },
            '& .MuiOutlinedInput-root':{
              '& fieldset':{ borderColor:'black'},
              '&:hover fieldset':{ borderColor:'black'},
              '&.Mui-focused fieldset':{ borderColor:'black'}
            },
          }}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.fullName}</TableCell>
                <TableCell>{ticket.email}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>{truncateText(ticket.description, 15)}</TableCell>
                <TableCell>
                  {ticket.status}
                  <IconButton onClick={(e) => handleStatusMenuClick(e, ticket)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, ticket)}>
                    <MoreHorizIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">No tickets found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(totalTickets / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
      />
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { onViewClick(selectedTicket); handleMenuClose(); }}>View</MenuItem>
        <MenuItem onClick={() => { onEditClick(selectedTicket); handleMenuClose(); }}>Edit</MenuItem>
        <MenuItem onClick={() => { onDeleteClick(selectedTicket._id); handleMenuClose(); }}>Delete</MenuItem>
      </Menu>

      <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
        <MenuItem onClick={() => handleStatusChange("Open")}>Open</MenuItem>
        <MenuItem onClick={() => handleStatusChange("Closed")}>Closed</MenuItem>
        <MenuItem onClick={() => handleStatusChange("In Progress")}>In Progress</MenuItem>
        <MenuItem onClick={() => handleStatusChange("Resolved")}>Resolved</MenuItem>
      </Menu>
    </TableContainer>
  );
};

export default TicketTable;
