import React from "react";
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
} from "@mui/material";

const TicketTable = ({ tickets, onViewClick, onDeleteClick }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
        All Tickets
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Sub-Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.fullName}</TableCell>
              <TableCell>{ticket.email}</TableCell>
              <TableCell>{ticket.phone}</TableCell>
              <TableCell>{ticket.address}</TableCell>
              <TableCell>{ticket.category}</TableCell>
              <TableCell>{ticket.subCategory}</TableCell>
              <TableCell>{ticket.description}</TableCell>
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
                  onClick={() => onDeleteClick(ticket.id)}
                >
                  ✕
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