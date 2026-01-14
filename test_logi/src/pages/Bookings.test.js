import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Bookings from './Bookings';

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    getToken: () => 'test-token',
  }),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Bookings Component', () => {
  test('renders bookings page', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    renderWithRouter(<Bookings />);
    expect(screen.getByText('Mes Réservations')).toBeInTheDocument();
  });
});

// Test 4: Bookings - Rendu sans réservations
test('Bookings renders no bookings message when empty', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );

  renderWithRouter(<Bookings />);

  await waitFor(() => {
    expect(screen.getByText('Mes Réservations')).toBeInTheDocument();
  });
});

// Test 5: Bookings - Affichage des réservations
test('Bookings displays list of bookings', async () => {
  const mockBookings = [
    {
      _id: '1',
      roomId: { name: 'Salle A' },
      date: '2024-01-15',
      time: '10:00',
    },
    {
      _id: '2',
      roomId: { name: 'Salle B' },
      date: '2024-01-16',
      time: '14:00',
    },
  ];

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockBookings),
    })
  );

  renderWithRouter(<Bookings />);

  await waitFor(() => {
    expect(screen.getByText('Salle A')).toBeInTheDocument();
    expect(screen.getByText('Salle B')).toBeInTheDocument();
  });
});

// Test 6: Bookings - Gestion des erreurs
test('Bookings handles fetch error gracefully', async () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network error'))
  );

  const consoleError = jest.spyOn(console, 'error').mockImplementation();

  renderWithRouter(<Bookings />);

  await waitFor(() => {
    expect(consoleError).toHaveBeenCalled();
  });

  consoleError.mockRestore();
});
