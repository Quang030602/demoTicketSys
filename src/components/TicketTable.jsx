import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField, InputAdornment, Pagination, Box, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const truncateText = (text, maxLength) => {
  return text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const TicketTable = ({ tickets, totalTickets, onSearch, onViewClick, onEditClick, onDoubleClick, page, rowsPerPage, setPage }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
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
              m: 1,
              ml: 'auto'
            }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
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
          {tickets.map((ticket) => (
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
              <TableCell>{ticket.status}</TableCell>
              <TableCell>
                <IconButton onClick={() => onViewClick(ticket)}>
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
    </TableContainer>
  );
};

export default TicketTable;
