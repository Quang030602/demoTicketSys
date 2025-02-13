import { Box, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import CreateTicketModal from "./components/TicketForm";
import TicketTable from "./components/TicketTable";
import EditTicketModal from "./components/utils/EditTicketModal";
import ViewTicketModal from "./components/ViewTicketModal";
import axios from "axios";

function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:4953/v1/tickets");
      
      
      setTickets(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ticket:", error.response ? error.response.data : error.message);
    }
  };
  
  
  // Hàm thêm ticket và gọi lại API
  const handleAddTicket = async (newTicket) => {
    try {
      // Gọi API để thêm ticket mới
      const response = await axios.get("http://localhost:4953/v1/tickets", newTicket, {
        headers: { "Content-Type": "application/json" },
      });
  
  
      // Cập nhật danh sách tickets ngay lập tức
      setTickets((prevTickets) => [...prevTickets, response.data]);
  
      // Gọi lại API để đảm bảo danh sách luôn mới nhất
      fetchTickets();
  
    } catch (error) {
      console.error("Lỗi khi thêm ticket:", error.response ? error.response.data : error.message);
    }
  };
  
  
  
  
  
  const handleEditClick = (ticket) => {
    if (!ticket || !ticket._id) {
      console.error("Invalid ticket data:", ticket);
      return;
    }
    setTicketToEdit(ticket); // Lưu thông tin ticket cần chỉnh sửa
    setIsEditModalOpen(true);
  };
  
  
  
  useEffect(() => {     
    fetchTickets();
  }, []);
  
  

  const handleUpdateTicket = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket._id === updatedTicket._id ? updatedTicket : ticket
      )
    );
    fetchTickets();
  };

  useEffect(() => {
    
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
        <Sidebar onCreateTicketClick={() => setIsCreateModalOpen(true)} setFilterStatus={setFilterStatus} filterStatus={filterStatus} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <TicketTable
            tickets={tickets}
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
      <ViewTicketModal ticket={selectedTicket} open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />
      <CreateTicketModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onAddTicket={handleAddTicket} />
      <EditTicketModal ticket={ticketToEdit} open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateTicket} />
    </>
  );
}

export default App;
