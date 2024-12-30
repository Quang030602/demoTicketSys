// File: components/CreateTicketModal.js
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem,
  Select, Stack, TextField,
  //Box,
  //Container,
  Typography
} from "@mui/material";
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

const CreateTicketModal = ({ open, onClose, onAddTicket }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",  
    description: "",
    file: null,
    category: "",
    subCategory: "",
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
      ...(name === "category" && value !== "general" ? { subCategory: "" } : {}), // Reset subCategory nếu đổi category
    }));
  };


  const handleAdd = () => {
    const { fullName, email, phone, category, description, subCategory } = formData;
  
    // Kiểm tra xem các trường cần thiết có được điền hay không
    if (fullName || email || phone || category || description || subCategory) {
      const ticket = {
        id: Date.now(), // Tạo ID duy nhất cho ticket
        fullName,
        email,
        phone,
        category,
        description,
        subCategory,
      };
  
      onAddTicket(ticket); // Gọi hàm onAddTicket với đối tượng ticket
      setFormData({ // Đặt lại formData về giá trị mặc định
        fullName: "",
        email: "",
        phone: "",
        category: "",
        description: "",
        subCategory: "",
        file: null,
      });
      onClose(); // Đóng modal
    }
  };
  const handleFileChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      file: event.target.files[0],
    }));
  };
  const handleClose = () => {
    setFormData({ // Đặt lại formData về giá trị mặc định
      fullName: "",
      email: "",
      phone: "",
      category: "",
      description: "",
      subCategory: "",
      file: null,
    });
    onClose(); // Đóng modal
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a Ticket</DialogTitle>
      <DialogContent>
      <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />

              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />             

              {/* Category Dropdown */}
              <FormControl fullWidth>
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
              {formData.category && formData.category !== "general" && (
                <FormControl fullWidth>
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
                required
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />

              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload File
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>

              {formData.file && (
                <Typography variant="body2" color="textSecondary">
                  Selected file: {formData.file.name}
                </Typography>
              )}
              
            </Stack>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleAdd} variant="contained" color="error">
          Add Ticket
        </Button>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTicketModal;
