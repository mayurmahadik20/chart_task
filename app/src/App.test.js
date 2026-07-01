import { render, screen } from '@testing-library/react';
import App from './App';

test('renders live students marks title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Live Students Marcks Updates with Interactive Charts/i);
  expect(titleElement).toBeInTheDocument();
});
