import http from 'http';
import app from './app.js';
import { initializeSocket } from './socket.js';

const port = process.env.PORT || 5000;

const server = http.createServer(app);
initializeSocket(server);

server.listen(
  port,"0.0.0.0",
  () => {
    console.log(`Server running on ${port}`);
  }
);