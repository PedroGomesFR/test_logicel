import { render, screen } from '@testing-library/react';
import App from './App';

test('renders EasyBooking app', () => {
  render(<App />);
  const titleElement = screen.getByText(/EasyBooking/i);
  expect(titleElement).toBeInTheDocument();
});
