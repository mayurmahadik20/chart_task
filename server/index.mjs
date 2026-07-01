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
let counter = 0;

const getRandomValue = () => Math.floor(Math.random() * 100);

const data = [
  { name: `${counter  }`,   value: getRandomValue() },
  { name: `${counter+1}`, value: getRandomValue() },
  { name: `${counter+2}`, value: getRandomValue() },
  { name: `${counter+3}`, value: getRandomValue() },
  { name: `${counter+4}`, value: getRandomValue() },
];

const emitData = () => {
  counter++;
  data.push({ name: counter, value: getRandomValue() });
  if (data.length > 20) data.shift();
  server.emit('message', data);
};

setInterval(emitData, 1000);

server.on('connection', (socket) => {
  console.log('connected');
});

httpServer.listen(port);




