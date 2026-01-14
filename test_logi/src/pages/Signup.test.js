import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from './Signup';

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Signup Component', () => {
  test('renders signup form', () => {
    renderWithRouter(<Signup />);
    expect(screen.getByText('Inscription')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "S'inscrire" })).toBeInTheDocument();
  });

  test('shows login link', () => {
    renderWithRouter(<Signup />);
    const loginLink = screen.getByText('Se connecter');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
});

// Test 1: Signup - Rendu correct
test('Signup renders form with all required fields', () => {
  renderWithRouter(<Signup />);
  expect(screen.getByText('Inscription')).toBeInTheDocument();
  expect(screen.getByText('Créez votre compte')).toBeInTheDocument();
  expect(screen.getByLabelText('Nom')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: "S'inscrire" })).toBeInTheDocument();
});

// Test 2: Signup - Mise à jour des champs
test('Signup updates input fields on change', () => {
  renderWithRouter(<Signup />);

  const nameInput = screen.getByLabelText('Nom');
  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Mot de passe');

  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(nameInput.value).toBe('John Doe');
  expect(emailInput.value).toBe('john@example.com');
  expect(passwordInput.value).toBe('password123');
});

// Test 3: Signup - Soumission réussie
test('Signup submits form with correct data', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        user: { id: '1', name: 'John', email: 'john@example.com' },
        token: 'test-token',
      }),
    })
  );

  renderWithRouter(<Signup />);

  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
  fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5001/api/auth/signup',
      expect.any(Object)
    );
  });
});
