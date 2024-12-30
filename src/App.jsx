// File: App.js
import { Box, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import CreateTicketModal from "./components/TicketForm";
//import { loadTickets, saveTickets } from "./components/Tickets/storage";
import TicketTable from "./components/TicketTable";
import ViewTicketModal from "./components/ViewTicketModal";
//import EditTicketModal from "./components/EditTicketModal";
function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  {/*
  // Load tickets from local storage on app start
  useEffect(() => {
    setTickets(loadTickets());
  }, []);

  // Save tickets to local storage whenever they change
  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);*/}
  // Hàm để cập nhật ticket
  const handleUpdateTicket = (updatedTicket) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === updatedTicket.id ? updatedTicket : ticket
  );
    setTickets(updatedTickets);
};
  // Function to handle ticket view
  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowForm(true);
    setIsViewModalOpen(true);
  };

  // Function to delete a ticket
  const handleDeleteTicket = (id) => {
    const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
    setTickets(updatedTickets);
  };

  // Function to add a new ticket
  const handleAddTicket = (newTicket) => {
    setTickets([...tickets, newTicket]);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setSelectedTicket(null);
    setShowForm(false);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Header />
        <Sidebar onCreateTicketClick={() => setIsCreateModalOpen(true)} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <TicketTable
            tickets={tickets}
            onViewClick={handleViewClick} // Pass handleViewClick here
            onDeleteClick={handleDeleteTicket}
          />
        </Box>
      </Box>

      <ViewTicketModal
        ticket={selectedTicket}
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <CreateTicketModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddTicket={handleAddTicket}
      />

      
    </>
  );
}

export default App;
