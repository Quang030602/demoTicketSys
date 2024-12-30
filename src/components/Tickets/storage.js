// File: src/components/ticket/storage.js
const STORAGE_KEY = "tickets";

export const loadTickets = () => {
  const storedTickets = localStorage.getItem(STORAGE_KEY);
  return storedTickets ? JSON.parse(storedTickets) : [];
};

export const saveTickets = (tickets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};
