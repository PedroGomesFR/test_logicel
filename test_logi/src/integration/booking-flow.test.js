import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// Note: On utilise fireEvent au lieu de userEvent.setup() (non disponible dans v13)
import { BrowserRouter } from "react-router-dom";
import App from "../App";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch API
global.fetch = jest.fn();

const mockRooms = [
  { _id: "1", name: "Salle A", capacity: 10 },
  { _id: "2", name: "Salle B", capacity: 20 },
  { _id: "3", name: "Salle C", capacity: 30 },
];

const mockUser = {
  _id: "user1",
  name: "Test User",
  email: "test@example.com",
};

const mockToken = "mock-jwt-token";

describe("Tests d'Intégration - Flux de Réservation Complet", () => {
  beforeEach(() => {
    localStorageMock.clear();
    global.fetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Flux complet: Inscription → Connexion → Réservation → Consultation", async () => {
    // Étape 1: Inscription
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: mockUser,
        token: mockToken,
      }),
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Aller à la page d'inscription
    const signupLink = screen.getByText("S'inscrire");
    fireEvent.click(signupLink);

    // Remplir le formulaire d'inscription
    fireEvent.change(screen.getByLabelText("Nom"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "S'inscrire" }));

    // Vérifier l'inscription
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/auth/signup",
        expect.any(Object)
      );
    });

    // Étape 2: Chargement des salles après connexion
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms,
    });

    await waitFor(() => {
      expect(screen.getByText("Liste des Salles")).toBeInTheDocument();
    });

    // Étape 3: Réserver une salle
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: "booking1",
        roomId: mockRooms[0]._id,
        date: "2024-01-15",
        time: "10:00",
      }),
    });

    const bookButtons = screen.getAllByText("Réserver");
    fireEvent.click(bookButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Réserver Salle A")).toBeInTheDocument();
    });

    const dateInput = screen.getByLabelText("Date");
    fireEvent.change(dateInput, { target: { value: "2024-01-15" } });

    const timeSelect = screen.getByLabelText("Heure");
    fireEvent.click(timeSelect);

    await waitFor(() => {
      const option = screen.getByText("10:00");
      fireEvent.click(option);
    });

    fireEvent.click(screen.getByText("Confirmer"));

    // Vérifier la réservation
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/bookings",
        expect.objectContaining({
          method: "POST",
        })
      );
    });

    // Étape 4: Consulter les réservations
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          _id: "booking1",
          roomId: { _id: "1", name: "Salle A" },
          date: "2024-01-15",
          time: "10:00",
        },
      ],
    });

    const bookingsLink = screen.getByText("Réservations");
    fireEvent.click(bookingsLink);

    await waitFor(() => {
      expect(screen.getByText("Mes Réservations")).toBeInTheDocument();
    });

    // Vérifier que les réservations sont chargées
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/bookings",
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        })
      );
    });
  });

  test("Réservation multiple de salles différentes", async () => {
    localStorageMock.setItem("user", JSON.stringify(mockUser));
    localStorageMock.setItem("token", mockToken);

    // Charger les salles
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Liste des Salles")).toBeInTheDocument();
    });

    // Réserver la première salle
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: "booking1",
        roomId: mockRooms[0]._id,
        date: "2024-01-15",
        time: "10:00",
      }),
    });

    const bookButtons = screen.getAllByText("Réserver");
    fireEvent.click(bookButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Réserver Salle A")).toBeInTheDocument();
    });

    const dateInput1 = screen.getByLabelText("Date");
    fireEvent.change(dateInput1, { target: { value: "2024-01-15" } });

    const timeSelect1 = screen.getByLabelText("Heure");
    fireEvent.click(timeSelect1);

    await waitFor(() => {
      const option = screen.getByText("10:00");
      fireEvent.click(option);
    });

    fireEvent.click(screen.getByText("Confirmer"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/bookings",
        expect.objectContaining({
          body: JSON.stringify({
            roomId: "1",
            date: "2024-01-15",
            time: "10:00",
          }),
        })
      );
    });

    // Recharger les salles pour la deuxième réservation
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRooms,
    });

    // Réserver la deuxième salle
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: "booking2",
        roomId: mockRooms[1]._id,
        date: "2024-01-15",
        time: "14:00",
      }),
    });

    // Retourner à la page des salles
    const roomsLink = screen.getByText("Salles");
    fireEvent.click(roomsLink);

    await waitFor(() => {
      expect(screen.getByText("Liste des Salles")).toBeInTheDocument();
    });

    const bookButtons2 = screen.getAllByText("Réserver");
    fireEvent.click(bookButtons2[1]);

    await waitFor(() => {
      expect(screen.getByText("Réserver Salle B")).toBeInTheDocument();
    });

    const dateInput2 = screen.getByLabelText("Date");
    fireEvent.change(dateInput2, { target: { value: "2024-01-15" } });

    const timeSelect2 = screen.getByLabelText("Heure");
    fireEvent.click(timeSelect2);

    await waitFor(() => {
      const option = screen.getByText("14:00");
      fireEvent.click(option);
    });

    fireEvent.click(screen.getByText("Confirmer"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/bookings",
        expect.objectContaining({
          body: JSON.stringify({
            roomId: "2",
            date: "2024-01-15",
            time: "14:00",
          }),
        })
      );
    });
  });
});
