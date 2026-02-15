const express = require('express');
const path = require('path');
const http = require('http');
const GameServer = require('./gameServer');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize game server with WebSocket
const gameServer = new GameServer(server);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle all routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server initialized`);
});
