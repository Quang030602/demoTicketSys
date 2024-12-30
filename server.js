// File: server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn đến file hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Đường dẫn đến file tickets.json
const ticketsFilePath = path.join(__dirname, 'tickets', 'tickets.json');

// Hàm để đọc tickets từ file
const readTicketsFromFile = () => {
  if (!fs.existsSync(ticketsFilePath)) {
    return [];
  }
  const data = fs.readFileSync(ticketsFilePath);
  return JSON.parse(data);
};

// Hàm để ghi tickets vào file
const writeTicketsToFile = (tickets) => {
  fs.writeFileSync(ticketsFilePath, JSON.stringify(tickets, null, 2));
};

// Route để lấy tất cả tickets
app.get('/api/tickets', (req, res) => {
  const tickets = readTicketsFromFile();
  res.json(tickets);
});

// Route để thêm một ticket mới
app.post('/api/tickets', (req, res) => {
  const { subject, status, title, description } = req.body;
  const newTicket = { id: Date.now(), subject, status, title, description };

  const tickets = readTicketsFromFile();
  tickets.push(newTicket);
  writeTicketsToFile(tickets);

  res.status(201).json(newTicket);
});

// Route để xóa một ticket
app.delete('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const tickets = readTicketsFromFile();
  const updatedTickets = tickets.filter(ticket => ticket.id !== parseInt(id));

  writeTicketsToFile(updatedTickets);
  res.status(204).send();
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});