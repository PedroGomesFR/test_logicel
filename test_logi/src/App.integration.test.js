// Mock the auth context
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const renderApp = () => {
  return render(<App />);
};

describe('EasyBooking Integration Tests', () => {
  beforeEach(() => {
    global.fetch.mockClear();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { _id: '1', name: 'Salle A', capacity: 10 },
        { _id: '2', name: 'Salle B', capacity: 20 },
        { _id: '3', name: 'Salle C', capacity: 5 },
      ]),
    });
    localStorageMock.getItem.mockReturnValue('fake-jwt-token');
    localStorageMock.setItem.mockClear();
  });

  test('complete booking flow', async () => {
    renderApp();

    // Should show rooms page (since user is logged in)
    expect(screen.getByText('Liste des Salles')).toBeInTheDocument();

    // Click book on first room
    const bookButtons = screen.getAllByText('Réserver');
    fireEvent.click(bookButtons[0]);

    // Dialog should open
    expect(screen.getByText('Réserver Salle A')).toBeInTheDocument();

    // Fill form
    const dateInput = screen.getByLabelText('Date');
    const timeSelect = screen.getByLabelText('Heure');

    fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
    fireEvent.change(timeSelect, { target: { value: '10:00' } });

    // Click confirm
    const confirmButton = screen.getByText('Confirmer');
    fireEvent.click(confirmButton);

    // Should save to localStorage
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'bookings',
        expect.stringContaining('"roomId":1')
      );
    });

    // Dialog should close
    expect(screen.queryByText('Réserver Salle A')).not.toBeInTheDocument();
  });

  test('navigation between pages', () => {
    renderApp();

    // Should start on rooms page
    expect(screen.getByText('Liste des Salles')).toBeInTheDocument();

    // Click bookings link
    const bookingsLink = screen.getByText('Réservations');
    fireEvent.click(bookingsLink);

    // Should show bookings page
    expect(screen.getByText('Mes Réservations')).toBeInTheDocument();
  });
});