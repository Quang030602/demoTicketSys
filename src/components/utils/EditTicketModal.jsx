import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const EditTicketModal = ({ ticket, open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "general",
    subCategory: "",
    description: "",
  });

  // Danh sách category và sub-category
  const categoryOptions = {
    general: [],
    technical: ["Issue A1", "Issue A2", "Issue A3"],
    billing: ["Billing Issue B1", "Billing Issue B2", "Billing Issue B3"],
    support: ["Support Query C1", "Support Query C2"],
  };
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
        {/* Category Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Category"
          >
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="technical">Technical</MenuItem>
            <MenuItem value="billing">Billing</MenuItem>
            <MenuItem value="support">Support</MenuItem>
          </Select>
        </FormControl>

        {/* Sub-Category Dropdown */}
        {formData.category !== "general" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Sub-Category</InputLabel>
            <Select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              label="Sub-Category"
            >
              {categoryOptions[formData.category]?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
