import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';
import socketIOClient from 'socket.io-client';

jest.mock('socket.io-client');

jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: (props) => <div data-testid="line-chart" data-chartdata={JSON.stringify(props.data)}>{props.children}</div>,
    BarChart: (props) => <div data-testid="bar-chart" data-chartdata={JSON.stringify(props.data)}>{props.children}</div>,
  };
});

describe('App', () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = {
      on: jest.fn(),
      disconnect: jest.fn(),
    };
    socketIOClient.mockReturnValue(mockSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Live Students Marcks Updates with Interactive Charts/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('connects to socket and updates data on message', () => {
    render(<App />);

    expect(socketIOClient).toHaveBeenCalledWith('http://127.0.0.1:4001/');
    expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function));

    // Simulate receiving data
    const messageCallback = mockSocket.on.mock.calls.find(call => call[0] === 'message')[1];

    const testData = [
      { name: '101', value: 85 },
      { name: '102', value: 90 }
    ];

    act(() => {
      messageCallback(testData);
    });

    const lineChart = screen.getByTestId('line-chart');
    const barChart = screen.getByTestId('bar-chart');

    expect(lineChart).toHaveAttribute('data-chartdata', JSON.stringify(testData));
    expect(barChart).toHaveAttribute('data-chartdata', JSON.stringify(testData));
  });
});
