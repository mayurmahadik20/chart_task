import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Live Students Marks Updates with Interactive Charts/i);
  expect(headerElement).toBeInTheDocument();
});
