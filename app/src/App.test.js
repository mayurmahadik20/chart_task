import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';
import socketIOClient from 'socket.io-client';

// Mock socket.io-client
jest.mock('socket.io-client');

// Mock recharts to avoid rendering complex SVGs and easily check passed data
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    LineChart: ({ children, data }) => (
      <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    BarChart: ({ children, data }) => (
      <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    CartesianGrid: () => null,
    Line: () => null,
    Bar: () => null,
    Brush: () => null,
  };
});

describe('App Component', () => {
  let mockSocket;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    mockSocket = {
      on: jest.fn(),
    };
    socketIOClient.mockReturnValue(mockSocket);
  });

  test('renders heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Live Students Marcks Updates with Interactive Charts/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('connects to socket server on mount', () => {
    render(<App />);
    expect(socketIOClient).toHaveBeenCalledWith('http://127.0.0.1:4001/');
  });

  test('listens for message event and updates charts with data', () => {
    render(<App />);

    // Verify socket.on was called for the 'message' event
    expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function));

    // Initial state: empty data array
    const lineChart = screen.getByTestId('line-chart');
    const barChart = screen.getByTestId('bar-chart');
    expect(lineChart.getAttribute('data-chart-data')).toBe('[]');
    expect(barChart.getAttribute('data-chart-data')).toBe('[]');

    // Extract the callback for the 'message' event
    const messageCallback = mockSocket.on.mock.calls.find(call => call[0] === 'message')[1];

    // Simulate incoming data
    const mockData = [
      { name: '1', value: 85 },
      { name: '2', value: 92 },
    ];

    // Trigger state update
    act(() => {
      messageCallback(mockData);
    });

    // Check if the charts received the new data
    expect(lineChart.getAttribute('data-chart-data')).toBe(JSON.stringify(mockData));
    expect(barChart.getAttribute('data-chart-data')).toBe(JSON.stringify(mockData));
  });
});
