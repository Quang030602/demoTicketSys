import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const EditTicketModal = ({ ticket, open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    
    if (ticket) {
      setFormData({
        id: ticket.id,
        fullName: ticket.fullName || "",
        email: ticket.email || "",
        category: ticket.category || "",
        description: ticket.description || "",
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log("ticket: ",ticket._id)
    if (!ticket?._id) {
      console.error("Error: Ticket ID is missing!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4953/v1/tickets/${ticket._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Không gửi ID lên vì API đã biết ID từ URL
      });

      if (response.ok) {
        onSave({ ...formData, id: ticket._id }); // Cập nhật state với ID giữ nguyên
        onClose();
      } else {
        console.error("Failed to update ticket");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Ticket</DialogTitle>
      <DialogContent>
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          label="Category"
          name="category"
          value={formData.category}
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          fullWidth
          multiline
          rows={3}
          margin="normal"
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="error">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketModal;
