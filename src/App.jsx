import { Box, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import CreateTicketModal from "./components/TicketForm";
import TicketTable from "./components/TicketTable";
import EditTicketModal from "./components/utils/EditTicketModal";
import ViewTicketModal from "./components/ViewTicketModal";

function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  

  const handleUpdateTicket = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket._id === updatedTicket._id ? updatedTicket : ticket
      )
    );
  };

  useEffect(() => {
    console.log("Filter status thay đổi:", filterStatus);
    console.log("Reset lại page về 1");
    setPage(1);
  }, [filterStatus]);
  
  useEffect(() => {
    console.log("Trang hiện tại:", page);
  }, [page]);
  useEffect(() => {
    setPage(1); // Reset page to 1 when switching sidebar filter
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
              console.log("Chuyển mục:", status); // Debug chuyển mục
              setFilterStatus(status);
              setPage(1);
              console.log("Set lại trang về 1"); // Kiểm tra setPage có chạy hay không
            }}
          />
        </Box>
      </Box>
      <ViewTicketModal ticket={selectedTicket} open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />
      <CreateTicketModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <EditTicketModal ticket={ticketToEdit} open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateTicket} />
    </>
  );
}

export default App;
