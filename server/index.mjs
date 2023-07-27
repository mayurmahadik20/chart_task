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
let counter = 0;

const getRandomValue = () => Math.floor(Math.random() * 100);

const data = [
  { name: `${counter  }`,   value: getRandomValue() },
  { name: `${counter+1}`, value: getRandomValue() },
  { name: `${counter+2}`, value: getRandomValue() },
  { name: `${counter+3}`, value: getRandomValue() },
  { name: `${counter+4}`, value: getRandomValue() },
];

server.on('connection', (socket) => {
  console.log('connected');
  if (timeChange) clearInterval(timeChange);

  const emitData = () => {
    counter++;
    data.push({ name: counter, value: getRandomValue() });
    if (data.length > 20) data.shift();
    socket.emit('message', data);
  };

  timeChange = setInterval(emitData, 1000);
});

httpServer.listen(port);




