import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Rooms from './Rooms';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Rooms Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  test('renders rooms list', () => {
    render(<Rooms />);
    expect(screen.getByText('Liste des Salles')).toBeInTheDocument();
    expect(screen.getByText('Salle A')).toBeInTheDocument();
    expect(screen.getByText('Salle B')).toBeInTheDocument();
    expect(screen.getByText('Salle C')).toBeInTheDocument();
  });

  test('shows book buttons', () => {
    render(<Rooms />);
    const bookButtons = screen.getAllByText('Réserver');
    expect(bookButtons).toHaveLength(3);
  });

  test('loads bookings from localStorage', () => {
    const mockBookings = JSON.stringify([
      { id: 1, roomId: 1, date: '2024-01-15', time: '10:00' }
    ]);
    localStorageMock.getItem.mockReturnValue(mockBookings);

    render(<Rooms />);
    // The component should load bookings on mount
    expect(localStorageMock.getItem).toHaveBeenCalledWith('bookings');
  });
});