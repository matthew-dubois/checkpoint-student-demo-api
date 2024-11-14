// server.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Initialize the WebSocket server instance
const wss = new WebSocket.Server({ server, path: '/ws' }); // Specify the path if needed

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  console.log('New client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Handle incoming messages if necessary
  });
});

// API endpoint to send messages
app.post('/send', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Broadcast the message to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  console.log('Message sent:', message);

  res.status(200).json({ success: true, message: 'Message sent.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
