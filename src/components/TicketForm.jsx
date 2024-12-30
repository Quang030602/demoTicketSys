import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const SupportTicketForm = ({ open, onClose, onAddTicket }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
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
      ...(name === "category" && value !== "general" ? { subCategory: "" } : {}),
    }));
  };

  const handleFileChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      file: event.target.files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    if (formData.file) {
      data.append("file", formData.file);
    }
    
    try {
      const response = await axios.post("http://localhost:5000/submit-ticket", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      alert("Ticket submitted successfully!");
      onAddTicket(response.data); // Call the onAddTicket prop to update the ticket list
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to submit the ticket. Please try again.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Submit a Support Ticket
          </Typography>

          <form onSubmit={handleSubmit}>
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

              <Button type="submit" variant="contained" color="primary" size="large">
                Submit Ticket
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SupportTicketForm;