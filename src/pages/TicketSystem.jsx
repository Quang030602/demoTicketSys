import { Box, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import CreateTicketModal from "../components//TicketForm";
import TicketTable from "../components/TicketTable";
import EditTicketModal from "../components/utils/EditTicketModal";
import ViewTicketModal from "../components/ViewTicketModal";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/user/userSlice"

function TicketSystem() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    console.log("User data:", user); // Log the user data to check its structure
    console.log("User ID:", user?.userRole); // Log the userId to check its value
    if (!user) {
      console.error("User data is not available. Please ensure the user is logged in.");
    }
  }, [user]);

  const fetchTickets = async (searchTerm = "", filterStatus = "all", page = 1, rowsPerPage = 8) => {
    try {
      let url = "http://localhost:4953/v1/tickets";
  
      if (searchTerm.trim()) {
        url += `?search=${searchTerm}`;
      } else if (filterStatus === "open") {
        url = "http://localhost:4953/v1/tickets/open";
      } else if (filterStatus === "closed") {
        url = "http://localhost:4953/v1/tickets/closed";
      }
  
      const response = await axios.get(url, {
        withCredentials: true, // ✅ Send cookies
      });
      const data = response.data;
  
      setTickets(Array.isArray(data) ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage) : []);
      setTotalTickets(data.length || 0);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
      setTotalTickets(0);
    }
  };
  
  useEffect(() => {
    fetchTickets("", filterStatus, page, 8);
  }, [filterStatus, page]);
  
  const handleSearch = async (searchTerm) => {
    setPage(1);
    await fetchTickets(searchTerm, filterStatus, 1, 8);
  };

  const handleAddTicket = async (formData) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || typeof userId !== "string") {
        console.error("Lỗi: userId không hợp lệ!", userId);
        alert("Lỗi: Không tìm thấy userId. Vui lòng đăng nhập lại!");
        return;
      }
  
      formData.append("userId", String(userId)); // Thêm userId vào FormData
  
      const response = await axios.post(
        "http://localhost:4953/v1/tickets",
        formData, // Gửi FormData
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // Đảm bảo gửi token trong cookies
        }
      );
  
      setTickets((prevTickets) => [...prevTickets, response.data]);
    } catch (error) {
      console.error(
        "Lỗi khi thêm ticket:",
        error.response ? error.response.data : error.message
      );
      alert(`Lỗi tạo ticket: ${error.response?.data?.message || "Không thể kết nối!"}`);
    }
  };
  
  
  const handleEditClick = (ticket) => {
    if (!ticket || !ticket._id) {
      console.error("Invalid ticket data:", ticket);
      return;
    }
    setTicketToEdit(ticket);
    setIsEditModalOpen(true);
  };

  const handleUpdateTicket = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket._id === updatedTicket._id ? updatedTicket : ticket
      )
    );
  };

  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  const handleDoubleClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Header />
        <Sidebar 
          onCreateTicketClick={() => setIsCreateModalOpen(true)} 
          setFilterStatus={setFilterStatus} 
          filterStatus={filterStatus} 
          user={user} // Pass the user object to Sidebar
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <TicketTable
            tickets={tickets}
            totalTickets={totalTickets} // Pass totalTickets for pagination
            onSearch={handleSearch} // Pass search handler
            onViewClick={handleViewClick}
            onDoubleClick={handleDoubleClick}
            page={page}
            rowsPerPage={8}
            setPage={setPage}
            filterStatus={filterStatus}
            onEditClick={handleEditClick}
          />
        </Box>
      </Box>
      <ViewTicketModal 
        ticket={selectedTicket} 
        open={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} />
      <CreateTicketModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onAddTicket={handleAddTicket} />
      <EditTicketModal 
        ticket={ticketToEdit} 
        open={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleUpdateTicket} />
    </>
  );
}

export default TicketSystem;