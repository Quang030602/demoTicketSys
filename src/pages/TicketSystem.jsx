import { Box, CssBaseline } from "@mui/material";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const [searchTerm, setSearchTerm] = useState(""); 
  const [rowsPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const [allTicketsCache, setAllTicketsCache] = useState([]);
  const user = useSelector(selectCurrentUser);
  const userRole = localStorage.getItem("userRole");
  
  // Refs to prevent unnecessary API calls
  const isInitialMount = useRef(true);
  const previousFilterStatus = useRef(filterStatus);
  const previousSearchTerm = useRef(searchTerm);
  
  useEffect(() => {
    if (!user) {
      console.error("User data is not available. Please ensure the user is logged in.");
    }
  }, [user]);

  // Apply filters and pagination from cache
  const applyFiltersAndPagination = useCallback(() => {
    if (allTicketsCache.length === 0) return;
    
    let filteredData = [...allTicketsCache];
    
    // Apply any client-side filtering if needed
    if (searchTerm && filteredData.length > 0) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(ticket => 
        ticket.fullName?.toLowerCase().includes(lowerSearchTerm) ||
        ticket.email?.toLowerCase().includes(lowerSearchTerm) ||
        ticket.description?.toLowerCase().includes(lowerSearchTerm) ||
        ticket.category?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Update total for pagination
    setTotalTickets(filteredData.length);
    
    // Apply pagination
    const paginatedData = filteredData.slice(
      (page - 1) * rowsPerPage, 
      page * rowsPerPage
    );
    
    setTickets(paginatedData);
  }, [allTicketsCache, page, rowsPerPage, searchTerm]);
  
  // Main fetch function
  const fetchTickets = useCallback(async () => {
    setLoading(true);
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
        withCredentials: true,
      });
      const data = response.data;
      
      // Store full dataset in cache
      setAllTicketsCache(Array.isArray(data) ? data : []);
      
      // Pagination is now handled separately in applyFiltersAndPagination
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setAllTicketsCache([]);
      setTickets([]);
      setTotalTickets(0);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchTerm]);
  
  // Single useEffect to handle all data loading scenarios
  useEffect(() => {
    // Initial load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchTickets();
      return;
    }
    
    // Filter or search term changed - need to fetch from server
    if (
      previousFilterStatus.current !== filterStatus || 
      previousSearchTerm.current !== searchTerm
    ) {
      previousFilterStatus.current = filterStatus;
      previousSearchTerm.current = searchTerm;
      fetchTickets();
      return;
    }
    
    // Just apply filters and pagination from cache for page changes
    applyFiltersAndPagination();
    
  }, [fetchTickets, applyFiltersAndPagination, filterStatus, searchTerm, page]);
  
  // Apply pagination after data is fetched
  useEffect(() => {
    if (allTicketsCache.length > 0) {
      applyFiltersAndPagination();
    }
  }, [allTicketsCache, applyFiltersAndPagination]);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleAddTicket = async (formData) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || typeof userId !== "string") {
        console.error("Lỗi: userId không hợp lệ!", userId);
        alert("Lỗi: Không tìm thấy userId. Vui lòng đăng nhập lại!");
        return;
      }
  
      formData.append("userId", String(userId));
  
      const response = await axios.post(
        "http://localhost:4953/v1/tickets",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      
      // Update cache with the new ticket
      const newTicket = response.data;
      setAllTicketsCache(prev => [newTicket, ...prev]);
      
      // Calculate new total number of tickets to determine page navigation
      const newTotalTickets = allTicketsCache.length + 1;
      const totalPages = Math.ceil(newTotalTickets / rowsPerPage);
      
      // If adding this ticket creates a new page, navigate to the first page
      // Since we're adding to the beginning of the array, new tickets appear on page 1
      setPage(1);
      
      // Apply pagination using cache - no need for another API call
      applyFiltersAndPagination();
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
    // Update cache only and let the UI refresh from it
    setAllTicketsCache(prevCache =>
      prevCache.map(ticket =>
        ticket._id === updatedTicket._id ? updatedTicket : ticket
      )
    );
    // No need to update tickets directly, applyFiltersAndPagination will handle it
  };

  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  const handleDoubleClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };
  const handleTicketsUpdate = (updatedTickets) => {
    setTickets(updatedTickets);
    // Nếu cần cập nhật total, bạn có thể làm như sau
    setTotalTickets(updatedTickets.length);
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
          user={userRole}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <TicketTable
          tickets={tickets}
          totalTickets={totalTickets}
          onSearch={handleSearch}
          onViewClick={handleViewClick}
          onDoubleClick={handleDoubleClick}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          onEditClick={handleEditClick}
          loading={loading}
          onTicketsUpdate={handleTicketsUpdate} // Thêm prop này
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