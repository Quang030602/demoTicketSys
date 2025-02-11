// File: components/TicketTable.jsx
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
const TicketTable = ({ tickets, onViewClick, onDeleteClick, onEditClick }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
        Tickets
      </Typography>
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