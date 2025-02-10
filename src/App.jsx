import { Box, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import CreateTicketModal from "./components/TicketForm";
import TicketTable from "./components/TicketTable";
import ViewTicketModal from "./components/ViewTicketModal";
import axios from "axios";

function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Gọi API để lấy danh sách ticket khi component được mount
  useEffect(() => {
    fetch("http://localhost:4953/v1/tickets")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, []);

  // Hàm thêm ticket
  const handleAddTicket = async (newTicket) => {
      console.log("newTicket ",newTicket)
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:4953/v1/tickets',
        headers: { }
      };
      
      axios.request(config)
      .then((response) => {
        setTickets(response.data)
      })
     
      .catch((error) => {
        console.log(error);
      });
  };  

  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Header />
        <Sidebar onCreateTicketClick={() => setIsCreateModalOpen(true)} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <TicketTable tickets={tickets} onViewClick={handleViewClick} />
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
