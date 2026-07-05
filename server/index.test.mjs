import test from 'node:test';
import assert from 'node:assert';
import { io as Client } from 'socket.io-client';
import child_process from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Server should emit message event with correctly formatted data', async (t) => {
  // Start the server process
  const serverProc = child_process.spawn('node', ['index.mjs'], {
    cwd: __dirname,
    detached: true,
    stdio: 'ignore'
  });

  // Wait for the server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  await new Promise((resolve, reject) => {
    const clientSocket = Client('http://localhost:4001');

    // Set a timeout in case the connection fails or messages aren't received
    const timeout = setTimeout(() => {
      clientSocket.disconnect();
      process.kill(-serverProc.pid);
      reject(new Error('Test timed out waiting for message'));
    }, 5000);

    clientSocket.on('connect', () => {
      // Successfully connected
    });

    clientSocket.on('connect_error', (err) => {
      clearTimeout(timeout);
      clientSocket.disconnect();
      process.kill(-serverProc.pid);
      reject(err);
    });

    clientSocket.on('message', (data) => {
      clearTimeout(timeout);

      try {
        // Assert the shape of the data
        assert.ok(Array.isArray(data), 'Data should be an array');
        assert.ok(data.length > 0, 'Data array should not be empty');
        assert.ok(data.length <= 20, 'Data array should not exceed 20 items');

        // Assert properties of the latest item
        const latestItem = data[data.length - 1];
        assert.ok('name' in latestItem, 'Item should have a name property');
        assert.ok('value' in latestItem, 'Item should have a value property');
        assert.strictEqual(typeof latestItem.value, 'number', 'Value should be a number');
        assert.ok(latestItem.value >= 0 && latestItem.value < 100, 'Value should be between 0 and 99');

        resolve();
      } catch (err) {
        reject(err);
      } finally {
        clientSocket.disconnect();
        process.kill(-serverProc.pid);
      }
    });
  });
});
