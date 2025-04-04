import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import  authorizedAxiosInstance  from '../../utils/authorizeAxios'

const EditTicketModal = ({ ticket, open, onClose, onSave, fetchTickets }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "general",
    subCategory: "",
    description: "",
    file: null,
    originalFileName: "",
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
        file: null, // Reset file input
        originalFileName: ticket.originalFileName || "",
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        file: file,
        originalFileName: file.name, // Cập nhật tên file mới
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prevState) => ({
      ...prevState,
      file: null, // Xóa file mới nếu có
      originalFileName: "", // Xóa tên file gốc
      removeFile: true, // Đánh dấu rằng file cần được xóa
    }));
  };

  const handleSave = async () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.description.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    const updatedData = new FormData();
    updatedData.append("fullName", formData.fullName);
    updatedData.append("email", formData.email);
    updatedData.append("category", formData.category);
    updatedData.append("subCategory", formData.subCategory);
    updatedData.append("description", formData.description);
  
    if (formData.file) {
      updatedData.append("file", formData.file); // Gửi file mới nếu có
    } else if (!formData.originalFileName) {
      updatedData.append("removeFile", true); // Gửi yêu cầu xóa file nếu không có file
    }
    // Log nội dung của FormData
  for (let [key, value] of updatedData.entries()) {
    console.log(`${key}:`, value);
  }
    try {
      const response = await authorizedAxiosInstance.put(
        `http://localhost:4953/v1/tickets/${ticket._id}`, 
        updatedData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );      
      console.log("Response:", response);           
      onSave(response.data);
      onClose();
       
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Không thể kết nối với server!");
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
        {/* Hiển thị file hiện tại hoặc thông báo không có file */}
        {formData.originalFileName ? (
          <Typography variant="body2" margin="normal">
            Attached File: {formData.originalFileName}{" "}
            <Button color="error" onClick={handleRemoveFile}>
              Remove
            </Button>
          </Typography>
        ) : (
          <Typography variant="body2" margin="normal" color="textSecondary">
            No file attached.
          </Typography>
        )}
        {/* Upload file mới */}
        <Button component="label" variant="contained" color="primary">
          Upload New File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="error">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketModal;