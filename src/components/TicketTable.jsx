// File: components/TicketTable.jsx
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";

const TicketTable = ({ tickets, onViewClick, onDeleteClick }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
        All Tickets
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Category</TableCell> {/* Thêm trường Category */}
            <TableCell>Description</TableCell> {/* Thêm trường Description */}
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
              <TableCell>{ticket.description}</TableCell> {/* Hiển thị mô tả */}
              <TableCell>
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
                  //onClick={() => onDeleteClick(ticket.id)}
                >
                  Edit
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