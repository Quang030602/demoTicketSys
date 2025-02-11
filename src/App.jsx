import { Box, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import CreateTicketModal from "./components/TicketForm";
import TicketTable from "./components/TicketTable";
import ViewTicketModal from "./components/ViewTicketModal";
import axios from "axios";
import EditTicketModal from "./components/utils/EditTicketModal"

function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState(null);


  // Gọi API để lấy danh sách ticket khi component được mount
  useEffect(() => {
    fetch("http://localhost:4953/v1/tickets")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
      })
      .catch((error) => console.error("Error fetching tickets:", error));
  }, []);
  
  const handleEditClick = (ticket) => {
    // Kiểm tra dữ liệu
    
    setTicketToEdit(ticket);

    setIsEditModalOpen(true);
  };
  const fetchAllTickets = async () => {
    try {
      const response = await fetch("http://localhost:4953/v1/tickets");
      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data = await response.json();
      setTickets(data); // Cập nhật danh sách ticket
    } catch (error) {
      console.error("Error fetching open tickets:", error);
    }
  };
  const fetchOpenTickets = async () => {
    try {
      const response = await fetch("http://localhost:4953/v1/tickets/open");
      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data = await response.json();
      setTickets(data); // Cập nhật danh sách ticket
    } catch (error) {
      console.error("Error fetching open tickets:", error);
    }
  };
  const fetchClosedTickets = async () => {
    try {
      const response = await fetch("http://localhost:4953/v1/tickets/closed");
      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data = await response.json();
      setTickets(data); // Cập nhật danh sách ticket
    } catch (error) {
      console.error("Error fetching open tickets:", error);
    }
  };
  
  const handleUpdateTicket = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
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
  
  const handleDeleteTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:4953/v1/tickets/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== id));
      } else {
        console.error("Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };
  

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
        <Sidebar onCreateTicketClick={() => setIsCreateModalOpen(true)} 
          onFetchOpenTickets={fetchOpenTickets} 
          onFetchClosedTickets={fetchClosedTickets} 
          onFetchAllTickets={fetchAllTickets} />

        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <TicketTable
            tickets={tickets}
            onViewClick={handleViewClick}
            onDeleteClick={handleDeleteTicket}
            onEditClick={handleEditClick}
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

      <EditTicketModal
        ticket={ticketToEdit}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateTicket} // Đảm bảo truyền đúng hàm
      />



    </>
  );
}

export default App;
