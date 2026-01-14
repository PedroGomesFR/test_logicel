import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Rooms from './Rooms';

// Mock AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
    getToken: () => 'mock-token',
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

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
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { _id: '1', name: 'Salle A', capacity: 10 },
        { _id: '2', name: 'Salle B', capacity: 20 },
        { _id: '3', name: 'Salle C', capacity: 30 },
      ],
    });
  });

  test('Rooms component renders within performance budget', () => {
    const startTime = performance.now();

    render(
      <BrowserRouter>
        <Rooms />
      </BrowserRouter>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render in less than 100ms
    expect(renderTime).toBeLessThan(100);

    // Verify content is rendered
    expect(screen.getByText('Liste des Salles')).toBeInTheDocument();
  });

  test('handles multiple rooms efficiently', () => {
    // Mock more rooms
    const originalUseState = React.useState;
    jest.spyOn(React, 'useState').mockImplementationOnce(() =>
      originalUseState([
        { id: 1, name: 'Salle A', capacity: 10 },
        { id: 2, name: 'Salle B', capacity: 20 },
        { id: 3, name: 'Salle C', capacity: 5 },
        { id: 4, name: 'Salle D', capacity: 15 },
        { id: 5, name: 'Salle E', capacity: 25 },
      ])
    );

    const startTime = performance.now();

    render(
      <BrowserRouter>
        <Rooms />
      </BrowserRouter>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should still render quickly even with more rooms
    expect(renderTime).toBeLessThan(200);
    expect(screen.getAllByText('Réserver')).toHaveLength(5);

    React.useState.mockRestore();
  });
});