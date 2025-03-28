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
  const user = useSelector(selectCurrentUser);
  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:4953/v1/tickets",{
        withCredentials: true // 🔥 Quan trọng để gửi cookie kèm request
      });
      setTickets(response.data);
      //console.log("danh sach tickets: ", response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ticket:", error.response ? error.response.data : error.message);
    }
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

  useEffect(() => {
    fetchTickets();
    setPage(1);
  }, [filterStatus]);

  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Header />
        <Sidebar onCreateTicketClick={() => setIsCreateModalOpen(true)} 
          setFilterStatus={setFilterStatus} 
          filterStatus={filterStatus} 
          user={user}
          />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <TicketTable
            tickets={tickets}
            setTickets={setTickets}
            onViewClick={handleViewClick}
            page={page}
            filterStatus={filterStatus}
            setFilterStatus={(status) => {
              setFilterStatus(status);
              setPage(1);
            }}
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