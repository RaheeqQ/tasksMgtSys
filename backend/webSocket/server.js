import { WebSocketServer } from 'ws';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://qassrawiraheeq:raheeq3763@cluster0.ay1q6xs.mongodb.net/TaskManager?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();

wss.on('connection', (ws) => {
  let currentUser = null;

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'join') {
      currentUser = data.username;
      clients.set(currentUser, ws);
    }

    if (data.type === 'message') {
      const { to, message: msg, from } = data;

      const newMsg = new Message({ from, to, message: msg });
      await newMsg.save();

      const targetSocket = clients.get(to);
      
      if (targetSocket && targetSocket.readyState === ws.OPEN) {
        targetSocket.send(JSON.stringify({
          type: 'message',
          from,
          message: msg,
        }));
      }
      ws.send(JSON.stringify({
        type: 'message',
        from: 'You',
        message: msg,
      }));
    }
  });

  ws.on('close', () => {
    if (currentUser) {
      clients.delete(currentUser);
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
