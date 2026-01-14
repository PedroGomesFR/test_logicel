# EasyBooking - Mini App de Réservation de Salles

Une application web simple pour réserver des salles avec authentification.

## Fonctionnalités

- **Connexion et Inscription** : Authentification utilisateur simple
- **Liste des Salles** : Affichage des salles disponibles
- **Réservation** : Réserver une salle avec date et heure
- **Mes Réservations** : Consulter ses réservations
- **Interface Simple** : Utilise shadcn/ui pour une UI moderne

## Technologies Utilisées

- React 19
- React Router pour la navigation
- Tailwind CSS pour le styling
- shadcn/ui pour les composants UI
- LocalStorage pour la persistance des données (simulation API)

## Installation

1. Clonez le repository :
   ```bash
   git clone https://github.com/PedroGomesFR/test_logicel.git
   cd test_logicel
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Démarrage

Pour lancer l'application en mode développement :
```bash
npm start
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Tests

Le projet inclut différents types de tests pour assurer la qualité et la fiabilité :

### Tests Unitaires
Testent les composants individuels :
```bash
npm test src/App.test.js
npm test src/pages/Login.test.js
npm test src/pages/Rooms.test.js
```

### Tests d'Intégration
Testent les interactions entre composants :
```bash
npm test src/App.integration.test.js
```

### Tests de Performance
Mesurent les performances de rendu :
```bash
npm test src/pages/Rooms.performance.test.js
```

### Tests Système (E2E) - Recommandé
Pour des tests système complets dans un vrai navigateur, installez Cypress :
```bash
npm install -D cypress
npx cypress open
```

Exemple de test E2E :
```javascript
describe('EasyBooking E2E', () => {
  it('complete booking flow', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Connexion').click()
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('password')
    cy.contains('Se connecter').click()
    cy.contains('Salle A').should('be.visible')
  })
})
```

### Exécution de Tous les Tests
```bash
# Mode interactif
npm test

# Exécuter tous les tests une fois
npm test -- --watchAll=false
```

### Couverture des Tests
Pour voir la couverture :
```bash
npm test -- --coverage
```

### Résultats des Tests
- ✅ **Tests unitaires** : Rendu des composants, interactions utilisateur
- ✅ **Tests d'intégration** : Flux complet de réservation
- ✅ **Tests de performance** : Temps de rendu < 100ms
- ✅ **Tests système** : Simulation utilisateur réel (avec Cypress)

## Build pour Production

Pour créer une version de production :
```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `build`.

## Utilisation

1. **Inscription/Connexion** : Créez un compte ou connectez-vous
2. **Voir les Salles** : Parcourez la liste des salles disponibles
3. **Réserver** : Cliquez sur "Réserver" pour une salle, choisissez date et heure
4. **Mes Réservations** : Consultez vos réservations dans l'onglet "Réservations"

## Structure du Projet

- `src/pages/` : Pages de l'application (Login, Signup, Rooms, Bookings)
- `src/components/ui/` : Composants UI réutilisables (shadcn/ui)
- `src/contexts/` : Context pour l'authentification
- `src/lib/` : Utilitaires

## API Simulation

L'application utilise localStorage pour simuler une API. En production, remplacez par des appels API réels.(https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
