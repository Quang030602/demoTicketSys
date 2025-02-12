// File: components/TicketTable.jsx
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TextField, InputAdornment,Input  } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
const TicketTable = ({onViewClick, onDeleteClick, onEditClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`http://localhost:4953/v1/tickets?search=${searchTerm}`);
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [searchTerm]);
  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
        Tickets
      </Typography>
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
              <SearchIcon sx={{color:'black'}}/>
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <CloseIcon 
                fontSize='small'
                sx={{color: 'black', cursor:'pointer'}}
                onClick={() => setSearchTerm('')}
              />
            </InputAdornment>
          )
        }}
        sx={{
          minWidth:'200px',
          maxWidth:'300px',
          backgroundColor: 'white',
          borderRadius: '5px',
          '& label':{
            color:'black',
          },
          '& label.Mui-focused':{
            color:'black',
          },
          '& input':{
            color:'black',
          },
          '& .MuiOutlinedInput-root':{
            '& fieldset':{ borderColor:'black'},
            '&:hover fieldset':{ borderColor:'black'},
            '&.Mui-focused fieldset':{ borderColor:'black'}
          },
        }}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Category</TableCell> {/* Thêm trường Category */}
            <TableCell>Description</TableCell> {/* Thêm trường Description */}
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              {/*<TableCell>{ticket.id}</TableCell>*/}
              <TableCell>{ticket.fullName}</TableCell> {/* Cập nhật từ fullname thành fullName */}
              <TableCell>{ticket.email}</TableCell>
              <TableCell>{ticket.category}</TableCell> {/* Hiển thị danh mục */}
              <TableCell>{truncateText(ticket.description, 15)}</TableCell> {/* Hiển thị mô tả */}
              <TableCell>{ticket.status}</TableCell>
              <TableCell sx = {{display: 'flex',
                                alignItems: 'center', 
                                gap: 1,
                                px: 1,}}>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => onViewClick(ticket)}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => onEditClick(ticket)}
                >
                  Edit
                </Button>
                <Button sx ={{g: 1, m:1 }}
                  variant="contained"
                  color="blue"
                  size="small"
                  onClick={() => onDeleteClick(ticket._id)} // Gọi hàm xóa
                >
                  Delete
                </Button>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TicketTable;