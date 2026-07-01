//two chart with zoom
import express from 'express';
import http from 'http';
import * as socketio from 'socket.io';

const port = 4001;
const app = express();
const httpServer = http.createServer(app);
const server = new socketio.Server(httpServer, {
  cors: {
    origin: '*',
  },
});
let timeChange;
let counter = 4;

const getRandomValue = () => Math.floor(Math.random() * 100);

const data = [
  { name: '0', value: getRandomValue() },
  { name: '1', value: getRandomValue() },
  { name: '2', value: getRandomValue() },
  { name: '3', value: getRandomValue() },
  { name: '4', value: getRandomValue() },
];

const emitData = () => {
  counter++;
  data.push({ name: `${counter}`, value: getRandomValue() });
  if (data.length > 20) data.shift();
  server.emit('message', data);
};

timeChange = setInterval(emitData, 1000);

server.on('connection', (socket) => {
  console.log('connected');
  socket.emit('message', data);
});

httpServer.listen(port);




