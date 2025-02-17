import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField, InputAdornment, Pagination, Box, IconButton, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from '@mui/icons-material/MoreVert';
const truncateText = (text, maxLength) => {
  return text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const TicketTable = ({tickets,setTickets, filterStatus, onViewClick, onEditClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ticketData, setTicketData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [totalTickets, setTotalTickets] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const handleSearch = async () => {
    try {
  
      // Nếu searchTerm trống, gọi fetchTickets để lấy danh sách đầy đủ
      if (!searchTerm.trim()) {
        fetchTickets();
        return;
      }
  
      let url = `http://localhost:4953/v1/tickets?search=${searchTerm}`;
  
      const response = await fetch(url);
      const data = await response.json();
  
  
      // Cập nhật danh sách tickets với kết quả tìm kiếm
      setTickets(Array.isArray(data) ? data.slice(0, rowsPerPage) : []);
      setTotalTickets(data.length || 0);
      
      // Reset về trang 1 khi tìm kiếm
      setPage(1);
  
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    }
  }; 
  

  const fetchTickets = async () => {
    // Nếu đang tìm kiếm, không gọi lại API lấy toàn bộ danh sách
    if (searchTerm.trim()) return;
  
    try {
      let url = "http://localhost:4953/v1/tickets";
      if (filterStatus === "open") { url = "http://localhost:4953/v1/tickets/open"; }
      else if (filterStatus === "closed") { url = "http://localhost:4953/v1/tickets/closed"; }  
  
      const response = await fetch(url);
      const data = await response.json();  
  
      // Cập nhật danh sách tickets nếu không có tìm kiếm
      setTickets(Array.isArray(data) ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage) : []);
      setTotalTickets(data.length || 0);
  
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    }
  };
  
  useEffect(() => {
    setTicketData(tickets);
  },[tickets]);

  const handleStatusChange = async (status) => {
    if (!selectedTicket) return;
    try {
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
  if (!searchTerm.trim()) {
    fetchTickets();
  }
}, [page, rowsPerPage, filterStatus]);


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

  const handleEditTicket = async (ticket) => {
    // if (!ticket) {
    //   console.error("LỖI: Không tìm thấy dữ liệu ticket!");
    //   return;
    // }
  
    // try {
    //   const response = await fetch(`http://localhost:4953/v1/tickets/${ticket._id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(ticket),
    //   });
  
    //   if (response.ok) {
    //     console.log("updatedTicket: ", response.data);
    //     const updatedTicket = await response.json();
    //     setTickets((prevTickets) =>
    //       prevTickets.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
    //     );
    //     onEditClick(updatedTicket); // Truyền toàn bộ đối tượng ticket thay vì chỉ ID
    //   } else {
    //     console.error("Failed to update ticket");
    //   }
    // } catch (error) {
    //   console.error("Error editing ticket:", error);
    // }
    console.log("Edit ticket: ", ticket);
    onEditClick(ticket);
    
  };
  

  return (
    <TableContainer component={Paper}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Tickets
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField 
        id="outlined-search"
        label="Search..."
        type="text"
        size='small'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'black' }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <CloseIcon 
                fontSize='small'
                sx={{ color: 'black', cursor: 'pointer' }}
                onClick={() => setSearchTerm('')}
              />
            </InputAdornment>
          ) : null
        }}
        sx={{
          minWidth: '250px',
          maxWidth: '350px',
          backgroundColor: 'white',
          borderRadius: '5px',
          
          m:1,      
          ml:'auto'
        }}
      />
      {/* Nút tìm kiếm */}
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Tìm kiếm
      </Button>
    </Box>
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
          {ticketData.map((ticket) => (
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
