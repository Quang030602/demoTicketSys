// File: components/ViewTicketModal.js
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
              label="Subject"
              value={ticket.subject}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Status"
              value={ticket.status}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Title"
              value={ticket.title}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
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
