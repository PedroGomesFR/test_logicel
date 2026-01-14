import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Rooms Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
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

  test('renders rooms list', async () => {
    renderWithRouter(<Rooms />);
    expect(screen.getByText('Liste des Salles')).toBeInTheDocument();
    
    // Attendre que les salles soient chargées
    await screen.findByText('Salle A');
    expect(screen.getByText('Salle A')).toBeInTheDocument();
    expect(screen.getByText('Salle B')).toBeInTheDocument();
    expect(screen.getByText('Salle C')).toBeInTheDocument();
  });

  test('shows book buttons', async () => {
    renderWithRouter(<Rooms />);
    await screen.findByText('Salle A');
    const bookButtons = screen.getAllByText('Réserver');
    expect(bookButtons).toHaveLength(3);
  });

  test('loads rooms from API', async () => {
    renderWithRouter(<Rooms />);
    
    await screen.findByText('Salle A');
    
    // Vérifier que l'API a été appelée
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5001/api/rooms');
  });
});