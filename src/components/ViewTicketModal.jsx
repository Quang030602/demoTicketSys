// File: components/ViewTicketModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const ViewTicketModal = ({ ticket, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ticket Details</DialogTitle>
      <DialogContent>
        {ticket && (
          <>
            <TextField
              label="ID"
              value={ticket.id}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Full Name"
              value={ticket.fullName}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Email"
              value={ticket.email}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            
            <TextField
              label="Category"
              value={ticket.category}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            {/* Hiển thị Sub-Category chỉ khi Category không phải là "General" */}
            {ticket.category !== "general" && (
              <TextField
                label="Sub-Category"
                value={ticket.subCategory}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
            )}
            <TextField
              label="Description"
              value={ticket.description}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTicketModal;