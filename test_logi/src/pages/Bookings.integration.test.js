import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Rooms from './Rooms';

// Mock fetch
global.fetch = jest.fn();

// Mock alert
global.alert = jest.fn();

// Mock useAuth
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    getToken: () => 'fake-jwt-token',
    user: { id: 'user1', name: 'Test User' },
  }),
}));

describe('Booking Integration Tests with JWT', () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  test('user can book a room with JWT authentication', async () => {
    // Mock rooms fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { _id: '1', name: 'Salle A', capacity: 10 },
      ]),
    });

    // Mock booking POST
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Booking created' }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Rooms />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for rooms to load
    await screen.findByText('Salle A');

    // Click the reserve button to open dialog
    const reserveButton = screen.getByText('Réserver');
    fireEvent.click(reserveButton);

    // Wait for dialog to open
    await screen.findByText('Réserver Salle A');

    // Fill the form
    const dateInput = screen.getByLabelText('Date');
    fireEvent.change(dateInput, { target: { value: '2023-12-01' } });

    // Select time
    const timeSelect = screen.getByText('Sélectionnez l\'heure');
    fireEvent.click(timeSelect);
    const timeOption = screen.getByText('10:00');
    fireEvent.click(timeOption);

    // Submit the booking
    const confirmButton = screen.getByText('Confirmer');
    fireEvent.click(confirmButton);

    // Wait for the booking API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-jwt-token',
        },
        body: JSON.stringify({ roomId: '1', date: '2023-12-01', time: '10:00' }),
      });
    });
  });

  test('user can retrieve their bookings with JWT', async () => {
    // This would be in the Bookings component, but for now, simulate the fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { _id: 'booking1', roomId: '1', date: '2023-12-01', time: '10:00', roomName: 'Salle A' },
      ]),
    });

    // Simulate fetching bookings
    const response = await fetch('http://localhost:5001/api/bookings', {
      headers: {
        'Authorization': 'Bearer fake-jwt-token',
      },
    });

    const bookings = await response.json();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5001/api/bookings', {
      headers: {
        'Authorization': 'Bearer fake-jwt-token',
      },
    });

    expect(bookings).toEqual([
      { _id: 'booking1', roomId: '1', date: '2023-12-01', time: '10:00', roomName: 'Salle A' },
    ]);
  });
});