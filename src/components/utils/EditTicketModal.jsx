import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const EditTicketModal = ({ ticket, open, onClose, onSave, fetchTickets }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "general",
    subCategory: "",
    description: "",
  });

  const categoryOptions = {
    general: [],
    technical: ["Issue A1", "Issue A2", "Issue A3"],
    billing: ["Billing Issue B1", "Billing Issue B2", "Billing Issue B3"],
    support: ["Support Query C1", "Support Query C2"],
  };

  useEffect(() => {
    if (ticket) {
      setFormData({
        fullName: ticket.fullName || "",
        email: ticket.email || "",
        category: ticket.category || "general",
        subCategory: ticket.subCategory || "",
        description: ticket.description || "",
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.description.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Email không hợp lệ!");
      return;
    }

    if (!ticket?._id) {
      console.error("Error: Ticket ID is missing!");
      return;
    }

    let updatedData = { ...formData };
    if (updatedData.category === "general") {
      delete updatedData.subCategory;
    }

    try {
      const response = await fetch(`http://localhost:4953/v1/tickets/${ticket._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedTicket = await response.json();
        onSave(updatedTicket);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Failed to update ticket:", errorData);
        alert(`Lỗi cập nhật: ${errorData.message || "Có lỗi xảy ra!"}`);
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Không thể kết nối với server!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Ticket</DialogTitle>
      <DialogContent>
        <TextField label="Full Name" name="fullName" value={formData.fullName} fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Email" name="email" value={formData.email} fullWidth margin="normal" onChange={handleChange} />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select name="category" value={formData.category} onChange={handleChange} label="Category">
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="technical">Technical</MenuItem>
            <MenuItem value="billing">Billing</MenuItem>
            <MenuItem value="support">Support</MenuItem>
          </Select>
        </FormControl>
        {formData.category !== "general" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Sub-Category</InputLabel>
            <Select name="subCategory" value={formData.subCategory} onChange={handleChange} label="Sub-Category">
              {categoryOptions[formData.category]?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField label="Description" name="description" value={formData.description} fullWidth multiline rows={3} margin="normal" onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="error">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketModal;
