import { io } from "socket.io-client";
import { performance } from "perf_hooks";

const PORT = 4001;
const NUM_CLIENTS = 100;
const DURATION = 5000;

let messagesReceived = 0;
const clients = [];

console.log(`Starting benchmark with ${NUM_CLIENTS} clients...`);

for (let i = 0; i < NUM_CLIENTS; i++) {
  const socket = io(`http://localhost:${PORT}`);
  socket.on("message", () => {
    messagesReceived++;
  });
  clients.push(socket);
}

setTimeout(() => {
  console.log(`Messages received in ${DURATION}ms: ${messagesReceived}`);
  console.log(`Expected (roughly): ${NUM_CLIENTS * (DURATION / 1000)}`);

  clients.forEach(c => c.disconnect());
  process.exit(0);
}, DURATION);
