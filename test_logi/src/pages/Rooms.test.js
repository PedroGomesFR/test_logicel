import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Rooms from './Rooms';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { _id: '1', name: 'Salle A', capacity: 10 },
      { _id: '2', name: 'Salle B', capacity: 20 },
      { _id: '3', name: 'Salle C', capacity: 5 },
    ]),
  })
);

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
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { _id: '1', name: 'Salle A', capacity: 10 },
          { _id: '2', name: 'Salle B', capacity: 20 },
          { _id: '3', name: 'Salle C', capacity: 5 },
        ]),
      })
    );
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  test('renders rooms list', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Rooms />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('Liste des Salles')).toBeInTheDocument();
    await screen.findByText('Salle A');
    expect(screen.getByText('Salle B')).toBeInTheDocument();
    expect(screen.getByText('Salle C')).toBeInTheDocument();
  });

  test('shows book buttons', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Rooms />
        </AuthProvider>
      </BrowserRouter>
    );
    await screen.findByText('Salle A');
    const bookButtons = screen.getAllByText('Réserver');
    expect(bookButtons).toHaveLength(3);
  });
});