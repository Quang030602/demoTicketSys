import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Typography, 
  TextField, 
  InputAdornment, 
  Pagination, 
  Box, 
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";

const truncateText = (text, maxLength) => {
  return text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const TicketTable = ({ 
  tickets, 
  totalTickets, 
  onSearch, 
  onViewClick, 
  onEditClick, 
  onDoubleClick, 
  page, 
  rowsPerPage, 
  setPage,
  loading = false,
  onTicketsUpdate  // Thêm prop mới để cập nhật state ở component cha
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, ticketId: null });
  const [localTickets, setLocalTickets] = useState(tickets);

  // Cập nhật localTickets khi tickets prop thay đổi
  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  // Reset page when filter status changes
  useEffect(() => {
    setPage(1);
  }, [setPage]);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  // Handler for action menu
  const handleActionClick = (e, ticket) => {
    // Prevent event from bubbling up to TableRow
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelectedTicket(ticket);
  };

  // Handler for status menu
  const handleStatusMenuClick = (event, ticket) => {
    event.stopPropagation();
    setStatusAnchor(event.currentTarget);
    setSelectedTicket(ticket);
  };

  // Handler for status change
  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;
    
    try {
      const response = await axios.patch(`http://localhost:4953/v1/tickets/${selectedTicket._id}/status`, {
        status: newStatus
      });
      
      if (response.status === 200) {
        // Cập nhật state locally
        const updatedTickets = localTickets.map(ticket => 
          ticket._id === selectedTicket._id 
            ? { ...ticket, status: newStatus } 
            : ticket
        );
        
        setLocalTickets(updatedTickets);
        
        // Cập nhật state ở component cha (nếu có)
        if (onTicketsUpdate) {
          onTicketsUpdate(updatedTickets);
        }
        
        // Hiển thị thông báo thành công
        setSnackbar({
          open: true,
          message: `Ticket status changed to "${newStatus}" successfully`,
          severity: "success"
        });
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update ticket status",
        severity: "error"
      });
    } finally {
      setStatusAnchor(null);
    }
  };

  // Handler for edit ticket
  const handleEditTicket = (ticket) => {
    onEditClick(ticket);
    setMenuAnchor(null);
  };

  // Show delete confirmation dialog
  const showDeleteConfirmation = (id) => {
    setDeleteDialog({
      open: true,
      ticketId: id
    });
    setMenuAnchor(null);
  };

  // Handler for delete ticket
  const handleDeleteTicket = async () => {
    const id = deleteDialog.ticketId;
    if (!id) return;
    
    try {
      const response = await axios.delete(`http://localhost:4953/v1/tickets/${id}`);
      if (response.status === 200) {
        // Cập nhật state locally
        const updatedTickets = localTickets.filter(ticket => ticket._id !== id);
        setLocalTickets(updatedTickets);
        
        // Cập nhật state ở component cha (nếu có)
        if (onTicketsUpdate) {
          onTicketsUpdate(updatedTickets);
        }
        
        // Cập nhật totalTickets
        if (onTicketsUpdate) {
          // Nếu có onTicketsUpdate, giả định rằng component cha sẽ xử lý totalTickets
        }
        
        // Hiển thị thông báo thành công
        setSnackbar({
          open: true,
          message: "Ticket deleted successfully",
          severity: "success"
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete ticket",
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setSnackbar({
        open: true,
        message: "Error deleting ticket",
        severity: "error"
      });
    } finally {
      setDeleteDialog({ open: false, ticketId: null });
    }
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
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'black' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <CloseIcon 
                    fontSize="small"
                    sx={{ color: 'black', cursor: 'pointer' }}
                    onClick={handleClearSearch}
                  />
                </InputAdornment>
              ) : null
            }}
            sx={{
              minWidth: '250px',
              maxWidth: '350px',
              backgroundColor: 'white',
              borderRadius: '5px',
              m: 1,
              ml: 'auto'
            }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
              {localTickets.length > 0 ? (
                localTickets.map((ticket) => (
                  <TableRow
                    key={ticket._id}
                    onDoubleClick={() => onDoubleClick(ticket)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell>{ticket.fullName}</TableCell>
                    <TableCell>{ticket.email}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>{truncateText(ticket.description, 15)}</TableCell>
                    <TableCell 
                      onClick={(e) => handleStatusMenuClick(e, ticket)}
                      sx={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    >
                      {ticket.status}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleActionClick(e, ticket)}>
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No tickets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {totalTickets > 0 && (
            <Pagination
              count={Math.ceil(totalTickets / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
            />
          )}
        </>
      )}

      {/* Status Menu */}
      <Menu 
        anchorEl={statusAnchor} 
        open={Boolean(statusAnchor)} 
        onClose={() => setStatusAnchor(null)}
      >
        <MenuItem onClick={() => handleStatusChange("Open")}>Open</MenuItem>
        <MenuItem onClick={() => handleStatusChange("Closed")}>Closed</MenuItem>
        <MenuItem onClick={() => handleStatusChange("In Progress")}>In Progress</MenuItem>
        <MenuItem onClick={() => handleStatusChange("Resolved")}>Resolved</MenuItem>
      </Menu>
      
      {/* Action Menu */}
      <Menu 
        anchorEl={menuAnchor} 
        open={Boolean(menuAnchor)} 
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => { onViewClick(selectedTicket); setMenuAnchor(null); }}>View</MenuItem>
        <MenuItem onClick={() => handleEditTicket(selectedTicket)}>Edit</MenuItem>
        <MenuItem onClick={() => showDeleteConfirmation(selectedTicket?._id)}>Delete</MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, ticketId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ticket? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, ticketId: null })} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteTicket} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
};

export default TicketTable;