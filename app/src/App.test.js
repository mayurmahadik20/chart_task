import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Live Students Marcks Updates with Interactive Charts/i);
  expect(linkElement).toBeInTheDocument();
});
