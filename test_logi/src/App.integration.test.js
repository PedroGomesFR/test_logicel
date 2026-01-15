import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
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

// Mock data
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

const mockBookings = [
  {
    _id: "booking1",
    roomId: { _id: "1", name: "Salle A" },
    date: "2024-01-15",
    time: "10:00",
  },
];

const renderApp = () => {
  return render(<App />);
};

describe("EasyBooking - Tests d'Intégration Complets", () => {
  beforeEach(() => {
    localStorageMock.clear();
    global.fetch.mockClear();
    // Reset fetch to default behavior
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({}),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Flux d'authentification complet", () => {
    test("1. Inscription d'un nouvel utilisateur", async () => {
      // Mock successful signup
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: mockUser,
          token: mockToken,
        }),
      });

      renderApp();

      // Vérifier qu'on est sur la page de login
      expect(screen.getByText("Connexion")).toBeInTheDocument();

      // Cliquer sur le lien d'inscription
      const signupLink = screen.getByText("S'inscrire");
      await user.click(signupLink);

      // Vérifier qu'on est sur la page d'inscription
      expect(screen.getByText("Inscription")).toBeInTheDocument();

      // Remplir le formulaire d'inscription
      const nameInput = screen.getByLabelText("Nom");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Mot de passe");
      const submitButton = screen.getByRole("button", { name: "S'inscrire" });

      await user.type(nameInput, "Test User");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      // Soumettre le formulaire
      await user.click(submitButton);

      // Vérifier que l'API a été appelée
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5001/api/auth/signup",
          expect.objectContaining({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "Test User",
              email: "test@example.com",
              password: "password123",
            }),
          })
        );
      });

      // Vérifier que l'utilisateur est connecté et redirigé
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify(mockUser)
        );
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "token",
          mockToken
        );
      });
    });

    test("2. Connexion d'un utilisateur existant", async () => {
      // Mock successful login
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: mockUser,
          token: mockToken,
        }),
      });

      renderApp();

      // Remplir le formulaire de connexion
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Mot de passe");
      const submitButton = screen.getByRole("button", { name: "Se connecter" });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Vérifier l'appel API
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5001/api/auth/login",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
              email: "test@example.com",
              password: "password123",
            }),
          })
        );
      });
    });

    test("3. Déconnexion d'un utilisateur connecté", async () => {
      // Simuler un utilisateur déjà connecté
      localStorageMock.setItem("user", JSON.stringify(mockUser));
      localStorageMock.setItem("token", mockToken);

      // Mock fetch pour les salles
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      renderApp();

      // Attendre que les salles soient chargées
      await waitFor(() => {
        expect(screen.getByText("Liste des Salles")).toBeInTheDocument();
      });

      // Cliquer sur le bouton de déconnexion
      const logoutButton = screen.getByText("Déconnexion");
      fireEvent.click(logoutButton);

      // Vérifier que l'utilisateur est déconnecté
      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
        expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
      });

      // Vérifier la redirection vers la page de login
      expect(screen.getByText("Connexion")).toBeInTheDocument();
    });
  });

  describe("Flux de réservation complet", () => {
    beforeEach(() => {
      // Simuler un utilisateur connecté
      localStorageMock.setItem("user", JSON.stringify(mockUser));
      localStorageMock.setItem("token", mockToken);
    });

    test("4. Affichage de la liste des salles", async () => {
      // Mock fetch pour les salles
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      renderApp();

      // Vérifier que les salles sont affichées
      await waitFor(() => {
        expect(screen.getByText("Liste des Salles")).toBeInTheDocument();
        expect(screen.getByText("Salle A")).toBeInTheDocument();
        expect(screen.getByText("Salle B")).toBeInTheDocument();
        expect(screen.getByText("Salle C")).toBeInTheDocument();
      });

      // Vérifier les capacités
      expect(screen.getByText("Capacité: 10")).toBeInTheDocument();
      expect(screen.getByText("Capacité: 20")).toBeInTheDocument();
      expect(screen.getByText("Capacité: 30")).toBeInTheDocument();
    });

    test("5. Réserver une salle avec succès", async () => {
      // Mock fetch pour les salles
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      // Mock fetch pour la réservation
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _id: "booking1",
          roomId: mockRooms[0]._id,
          date: "2024-01-15",
          time: "10:00",
        }),
      });

      renderApp();

      // Attendre que les salles soient chargées
      await waitFor(() => {
        expect(screen.getByText("Salle A")).toBeInTheDocument();
      });

      // Cliquer sur le bouton Réserver de la première salle
      const bookButtons = screen.getAllByText("Réserver");
      fireEvent.click(bookButtons[0]);

      // Vérifier que le dialog s'ouvre
      await waitFor(() => {
        expect(screen.getByText("Réserver Salle A")).toBeInTheDocument();
      });

      // Remplir le formulaire de réservation
      const dateInput = screen.getByLabelText("Date");
      fireEvent.change(dateInput, { target: { value: "2024-01-15" } });

      // Sélectionner l'heure (utiliser fireEvent pour le Select de Radix UI)
      const timeSelect = screen.getByLabelText("Heure");
      fireEvent.click(timeSelect);

      // Attendre que les options apparaissent et cliquer sur 10:00
      await waitFor(() => {
        const option = screen.getByText("10:00");
        fireEvent.click(option);
      });

      // Cliquer sur Confirmer
      const confirmButton = screen.getByText("Confirmer");
      fireEvent.click(confirmButton);

      // Vérifier l'appel API de réservation
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5001/api/bookings",
          expect.objectContaining({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${mockToken}`,
            },
            body: JSON.stringify({
              roomId: "1",
              date: "2024-01-15",
              time: "10:00",
            }),
          })
        );
      });
    });

    test("6. Afficher les réservations de l'utilisateur", async () => {
      // Mock fetch pour les salles (nécessaire pour la navigation)
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      // Mock fetch pour les réservations
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookings,
      });

      renderApp();

      // Attendre que l'app se charge
      await waitFor(() => {
        expect(screen.getByText("Liste des Salles")).toBeInTheDocument();
      });

      // Cliquer sur le lien Réservations
      const bookingsLink = screen.getByText("Réservations");
      fireEvent.click(bookingsLink);

      // Vérifier qu'on est sur la page des réservations
      await waitFor(() => {
        expect(screen.getByText("Mes Réservations")).toBeInTheDocument();
      });

      // Vérifier que les réservations sont affichées
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
  });

  describe("Navigation et protection des routes", () => {
    test("7. Redirection vers login si non connecté", () => {
      // Pas d'utilisateur connecté
      localStorageMock.clear();

      renderApp();

      // Vérifier qu'on est redirigé vers la page de login
      expect(screen.getByText("Connexion")).toBeInTheDocument();
      expect(screen.queryByText("Liste des Salles")).not.toBeInTheDocument();
    });

    test("8. Navigation entre les pages pour un utilisateur connecté", async () => {
      localStorageMock.setItem("user", JSON.stringify(mockUser));
      localStorageMock.setItem("token", mockToken);

      // Mock fetch pour les salles
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      renderApp();

      // Vérifier qu'on est sur la page des salles
      await waitFor(() => {
        expect(screen.getByText("Liste des Salles")).toBeInTheDocument();
      });

      // Naviguer vers les réservations
      const bookingsLink = screen.getByText("Réservations");
      fireEvent.click(bookingsLink);

      await waitFor(() => {
        expect(screen.getByText("Mes Réservations")).toBeInTheDocument();
      });

      // Naviguer vers les salles
      const roomsLink = screen.getByText("Salles");
      fireEvent.click(roomsLink);

      await waitFor(() => {
        expect(screen.getByText("Liste des Salles")).toBeInTheDocument();
      });
    });
  });

  describe("Gestion des erreurs", () => {
    beforeEach(() => {
      localStorageMock.setItem("user", JSON.stringify(mockUser));
      localStorageMock.setItem("token", mockToken);
    });

    test("9. Gestion d'erreur lors de la connexion", async () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => { });

      // Mock fetch avec erreur
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Email ou mot de passe incorrect",
        }),
      });

      renderApp();

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Mot de passe");
      const submitButton = screen.getByRole("button", { name: "Se connecter" });

      fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Email ou mot de passe incorrect"
        );
      });

      alertSpy.mockRestore();
    });

    test("10. Gestion d'erreur lors de la réservation", async () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => { });

      // Mock fetch pour les salles
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      // Mock fetch pour la réservation avec erreur
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Salle déjà réservée à cette heure",
        }),
      });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText("Salle A")).toBeInTheDocument();
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

      const confirmButton = screen.getByText("Confirmer");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Salle déjà réservée à cette heure"
        );
      });

      alertSpy.mockRestore();
    });
  });
});
