import { render, screen } from '@testing-library/react';
import App from './App';

test('renders heading correctly', () => {
  render(<App />);
  const headingElement = screen.getByText(/Live Students Marks Updates with Interactive Charts/i);
  expect(headingElement).toBeInTheDocument();
});
