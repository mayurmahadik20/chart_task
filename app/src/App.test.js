import { render, screen } from '@testing-library/react';
import App from './App';

test('renders heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Live Students Marcks Updates with Interactive Charts/i);
  expect(headingElement).toBeInTheDocument();
});
