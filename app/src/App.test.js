import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header text', () => {
  render(<App />);
  const headerElement = screen.getByText(/Live Students Marcks Updates with Interactive Charts/i);
  expect(headerElement).toBeInTheDocument();
});
