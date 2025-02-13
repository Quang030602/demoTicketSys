import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField, InputAdornment, Pagination, Box, IconButton, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from '@mui/icons-material/MoreVert';
const truncateText = (text, maxLength) => {
  return text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const TicketTable = ({ filterStatus, onViewClick, onEditClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [totalTickets, setTotalTickets] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let url = `http://localhost:4953/v1/tickets?search=${searchTerm}`;
        const response = await fetch(url);
        const data = await response.json();
  
        // Cập nhật danh sách tickets dựa trên phân trang
        setTickets(Array.isArray(data) ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage) : []);
  
        // Cập nhật số lượng totalTickets để pagination hoạt động đúng
        setTotalTickets(data.length || 0);
        
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setTickets([]);
      }
    };
  
    fetchTickets();
  }, [searchTerm, page, rowsPerPage]);
  

  const fetchTickets = async () => {
    try {
      
      let url = "http://localhost:4953/v1/tickets";
      if (filterStatus === "open" ) {url = "http://localhost:4953/v1/tickets/open";}
      else if (filterStatus === "closed") {url = "http://localhost:4953/v1/tickets/closed";}
      
      const response = await fetch(url);
      const data = await response.json();
      setTickets(Array.isArray(data) ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage) : []);
      setTotalTickets(data.length || 0);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    }
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
  useEffect(() => {
    
    fetchTickets();
  }, [searchTerm, page, rowsPerPage, filterStatus]);

  const handleMenuClick = (event, ticket) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTicket(ticket);
  };

  const handleStatusMenuClick = (event, ticket) => {
    setStatusAnchor(event.currentTarget);
    setSelectedTicket(ticket);
  };
  useEffect(() => {
    setPage(1);
  }, [filterStatus]);
  
  useEffect(() => {
    console.log("Ticket Table cập nhật, danh sách mới:", tickets);
  }, [tickets]);
  
  const handleDeleteTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:4953/v1/tickets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTickets();
      } else {
        console.error("Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleEditTicket = (ticket) => {
   console.log("Ticket được chọn để chỉnh sửa:", ticket);
  
  if (!ticket) {
    console.error("LỖI: Không tìm thấy dữ liệu ticket!");
    return;
  }
    try {
      onEditClick(ticket); // Truyền toàn bộ đối tượng ticket thay vì chỉ ID
      fetchTickets();
    } catch (error) {
      console.error("Error editing ticket:", error);
    }
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
          {tickets.map((ticket) => (
            <TableRow key={ticket._id}>
              <TableCell>{ticket.fullName}</TableCell>
              <TableCell>{ticket.email}</TableCell>
              <TableCell>{ticket.category}</TableCell>
              <TableCell>{truncateText(ticket.description, 15)}</TableCell>
              <TableCell>
                {ticket.status}
                {filterStatus === "all" && (
                  <IconButton onClick={(e) => handleStatusMenuClick(e, ticket)}>
                    <MoreVertIcon />
                  </IconButton>
                )}
              </TableCell>
              <TableCell>
                <IconButton onClick={(e) => handleMenuClick(e, ticket)}>
                  <MoreHorizIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(totalTickets / rowsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
      />
      <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
        <MenuItem onClick={() => handleStatusChange("Open")}>Open</MenuItem>
        <MenuItem onClick={() => handleStatusChange("Closed")}>Closed</MenuItem>
        <MenuItem onClick={() => handleStatusChange("In Progress")}>In Progress</MenuItem>
        <MenuItem onClick={() => handleStatusChange("Resolved")}>Resolved</MenuItem>
      </Menu>    
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => { onViewClick(selectedTicket); setMenuAnchor(null); }}>View</MenuItem>
        <MenuItem onClick={() => { handleEditTicket(selectedTicket); setMenuAnchor(null); }}>Edit</MenuItem>
        <MenuItem onClick={() => { handleDeleteTicket(selectedTicket._id); setMenuAnchor(null); }}>Delete</MenuItem>
      </Menu>
    </TableContainer>
  );
};

export default TicketTable;
