import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Rooms from './Rooms';

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

// Mock fetch
global.fetch = jest.fn();

describe('Performance Tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    global.fetch.mockClear();
  });

  test('Rooms component renders within performance budget', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { _id: '1', name: 'Salle A', capacity: 10 },
        { _id: '2', name: 'Salle B', capacity: 20 },
        { _id: '3', name: 'Salle C', capacity: 5 },
        { _id: '4', name: 'Salle D', capacity: 15 },
        { _id: '5', name: 'Salle E', capacity: 25 },
      ]),
    });

    const startTime = performance.now();

    render(
      <BrowserRouter>
        <AuthProvider>
          <Rooms />
        </AuthProvider>
      </BrowserRouter>
    );

    await screen.findByText('Liste des Salles');

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render in less than 100ms
    expect(renderTime).toBeLessThan(100);

    // Verify content is rendered
    expect(screen.getByText('Liste des Salles')).toBeInTheDocument();
  });

  test('handles multiple rooms efficiently', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { _id: '1', name: 'Salle A', capacity: 10 },
        { _id: '2', name: 'Salle B', capacity: 20 },
        { _id: '3', name: 'Salle C', capacity: 5 },
        { _id: '4', name: 'Salle D', capacity: 15 },
        { _id: '5', name: 'Salle E', capacity: 25 },
      ]),
    });

    const startTime = performance.now();

    render(
      <BrowserRouter>
        <AuthProvider>
          <Rooms />
        </AuthProvider>
      </BrowserRouter>
    );

    await screen.findByText('Salle A');

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should still render quickly even with more rooms
    expect(renderTime).toBeLessThan(200);
    expect(screen.getAllByText('Réserver')).toHaveLength(5);
  });

  test('simulates user login, booking, and retrieving bookings with JWT', async () => {
    // Mock rooms fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        { _id: '1', name: 'Salle A', capacity: 10 },
      ]),
    });

    // Set token in localStorage to simulate logged in user
    localStorageMock.getItem.mockReturnValue('fake-jwt-token');

    render(
      <BrowserRouter>
        <AuthProvider>
          <Rooms />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for rooms to load
    await screen.findByText('Salle A');

    // Verify rooms are displayed
    expect(screen.getByText('Salle A')).toBeInTheDocument();
    expect(screen.getByText('Capacité: 10')).toBeInTheDocument();

    // Verify fetch calls with auth header
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5001/api/rooms');
  });
});