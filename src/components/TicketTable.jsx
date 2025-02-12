// File: components/TicketTable.jsx
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";

const truncateText = (text, maxLength) => {
  return text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const TicketTable = ({ filterStatus, onViewClick, onEditClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalTickets, setTotalTickets] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

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
    fetchTickets();
  }, [searchTerm, page, rowsPerPage, filterStatus]);
  
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
    try {
      await onEditClick(ticket);
      fetchTickets();
    } catch (error) {
      console.error("Error editing ticket:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
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
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => { onViewClick(selectedTicket); setMenuAnchor(null); }}>View</MenuItem>
        <MenuItem onClick={() => { handleEditTicket(selectedTicket); setMenuAnchor(null); }}>Edit</MenuItem>
        <MenuItem onClick={() => { handleDeleteTicket(selectedTicket._id); setMenuAnchor(null); }}>Delete</MenuItem>
      </Menu>
    </TableContainer>
  );
};

export default TicketTable;
