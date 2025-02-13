// File: components/CreateTicketModal.js
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem,
  Select, Stack, TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const CreateTicketModal = ({ open, onClose,onAddTicket }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",  
    address: "",
    description: "",
    category: "",
    subCategory: "",
    file: null,
  });

  const categoryOptions = {
    technical: ["Issue A1", "Issue A2", "Issue A3"],
    billing: ["Billing Issue B1", "Billing Issue B2", "Billing Issue B3"],
    support: ["Support Query C1", "Support Query C2"],
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "category" && value !== "general" ? { subCategory: "" } : {}),
    }));
  };
  
  const handleAdd = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.category || !formData.description) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:4953/v1/tickets", formData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 201 || response.status === 200) { 
  
        onAddTicket(response.data); // Gọi App.jsx để cập nhật danh sách ticket
  
        onClose(); // Đóng modal ngay sau khi thêm
  
        // Reset form sau khi thêm ticket thành công
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          category: "",
          description: "",
          subCategory: "",
          file: null,
        });
  
      } else {
        alert("Không thể tạo ticket! Kiểm tra API.");
      }
  
    } catch (error) {
      console.error("Lỗi khi tạo ticket:", error.response ? error.response.data : error.message);
      alert("Không thể tạo ticket! Kiểm tra API.");
    }
  };
  
  
  
  
    
  

  const handleFileChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      file: event.target.files[0],
    }));
  };

  const handleClose = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      description: "",
      subCategory: "",
      file: null,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a Ticket</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
          <TextField fullWidth label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
          <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select name="category" value={formData.category} onChange={handleChange} label="Category">
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="billing">Billing</MenuItem>
              <MenuItem value="support">Support</MenuItem>
            </Select>
          </FormControl>
          {formData.category && formData.category !== "general" && (
            <FormControl fullWidth>
              <InputLabel>Sub-Category</InputLabel>
              <Select name="subCategory" value={formData.subCategory} onChange={handleChange} label="Sub-Category">
                {categoryOptions[formData.category]?.map((option, index) => (
                  <MenuItem key={index} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField fullWidth label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} required />
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload File
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          {formData.file && (
            <Typography variant="body2" color="textSecondary">Selected file: {formData.file.name}</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAdd} variant="contained" color="error">Add Ticket</Button>
        <Button onClick={handleClose} color="error">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTicketModal;
