import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import App from "./App";

// Mock fetch API
global.fetch = jest.fn();

describe("Tests d'Intégration - EasyBooking (10 tests)", () => {
  beforeEach(() => {
    global.fetch.mockClear();
    localStorage.clear();
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

  // ========== TESTS DE LA PAGE LOGIN ==========

  // Test 1: L'application charge et affiche le titre
  test("1. L'application affiche le titre EasyBooking", () => {
    render(<App />);
    
    const titleElements = screen.getAllByText("EasyBooking");
    expect(titleElements.length).toBeGreaterThan(0);
  });

  // Test 2: La page de login affiche "Bienvenue"
  test("2. La page de login affiche le titre Bienvenue", () => {
    render(<App />);
    
    expect(screen.getByText("Bienvenue")).toBeInTheDocument();
  });

  // Test 3: La page de login affiche le sous-titre
  test("3. La page de login affiche le sous-titre de connexion", () => {
    render(<App />);
    
    expect(screen.getByText("Connectez-vous à votre compte")).toBeInTheDocument();
  });

  // Test 4: Le formulaire de login contient le champ Email
  test("4. Le formulaire de login contient le champ Email", () => {
    render(<App />);
    
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("votre@email.com")).toBeInTheDocument();
  });

  // Test 5: Le formulaire de login contient le champ Mot de passe
  test("5. Le formulaire de login contient le champ Mot de passe", () => {
    render(<App />);
    
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  // Test 6: Le bouton "Se connecter" est présent
  test("6. Le bouton Se connecter est présent et cliquable", () => {
    render(<App />);
    
    const loginButton = screen.getByRole("button", { name: "Se connecter" });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).not.toBeDisabled();
  });

  // Test 7: Le lien vers l'inscription est visible
  test("7. Le lien vers la page d'inscription est visible", () => {
    render(<App />);
    
    expect(screen.getByText("Pas de compte?")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });

  // ========== TESTS DES INTERACTIONS ==========

  // Test 8: On peut saisir un email dans le champ
  test("8. On peut saisir un email dans le champ Email", () => {
    render(<App />);
    
    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    
    expect(emailInput.value).toBe("test@example.com");
  });

  // Test 9: On peut saisir un mot de passe dans le champ
  test("9. On peut saisir un mot de passe dans le champ Mot de passe", () => {
    render(<App />);
    
    const passwordInput = screen.getByLabelText("Mot de passe");
    fireEvent.change(passwordInput, { target: { value: "mypassword123" } });
    
    expect(passwordInput.value).toBe("mypassword123");
  });

  // Test 10: La soumission du formulaire appelle l'API login
  test("10. La soumission du formulaire de login appelle l'API", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    render(<App />);
    
    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "password123" },
    });
    
    // Soumettre le formulaire
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));
    
    // Vérifier que l'API a été appelée
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            email: "user@test.com",
            password: "password123",
          }),
        })
      );
    });
  });
});
