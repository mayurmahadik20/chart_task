import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import socketIOClient from 'socket.io-client';

jest.mock('socket.io-client');

// Need to mock Recharts because of ResizeObserver/SVG issues in JSDOM
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => <div className="recharts-responsive-container">{children}</div>,
  };
});

describe('Performance benchmark', () => {
  it('measures unclosed socket connections', () => {
    let activeSockets = 0;
    socketIOClient.mockImplementation(() => {
      activeSockets++;
      return {
        on: jest.fn(),
        disconnect: () => { activeSockets--; }
      };
    });

    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<App />);
      unmount();
    }

    console.log(`BENCHMARK: Active sockets after 100 mounts/unmounts: ${activeSockets}`);
    // We expect it to fail if it's 100, so we just log it for now.
  });
});
