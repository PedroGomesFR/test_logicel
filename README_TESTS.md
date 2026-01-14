# 📋 Documentation des Tests

Ce document décrit tous les tests disponibles dans le projet et les commandes pour les exécuter.

## 📁 Structure des Tests

Le projet contient deux ensembles de tests :
- **Backend (Server)** : Tests pour l'API Node.js/Express
- **Frontend (test_logi)** : Tests pour l'application React

---

## 🖥️ Tests Backend (Server)

### Localisation
Les tests sont situés dans `/server/test/`

### Framework utilisé
- **Jest** : Framework de test
- **Supertest** : Test des endpoints HTTP

### Tests disponibles

#### 1. Tests des Utilisateurs
**Fichier** : `test/User.test.js`
- Inscription (signup)
- Connexion (login)
- Validation des données

#### 2. Tests des Salles
**Fichier** : `test/Room.test.js`
- Création de salles
- Récupération des salles
- Mise à jour et suppression

#### 3. Tests des Réservations
**Fichier** : `test/Booking.test.js`
- Création de réservations
- Récupération des réservations
- Gestion des conflits

#### 4. Tests de Performance
**Fichier** : `test/performance-test.js`
- Tests de charge avec k6
- Simulation de 5 utilisateurs virtuels
- Durée : 1 minute

### 🚀 Commandes Backend

```bash
# Se placer dans le dossier server
cd server

# Installer les dépendances
npm install

# Lancer tous les tests Jest
npm test

# Lancer les tests en mode watch
npm test -- --watch

# Lancer un fichier de test spécifique
npm test -- User.test.js
npm test -- Room.test.js
npm test -- Booking.test.js

# Lancer les tests avec couverture de code
npm test -- --coverage

# Tests de performance avec k6 (nécessite k6 installé)
k6 run ./test/performance-test.js
```

### 📦 Installation de k6 (pour tests de performance)

```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6

# Windows
choco install k6
```

---

## 🎨 Tests Frontend (React)

### Localisation
Les tests sont situés dans `/test_logi/src/`

### Framework utilisé
- **Jest** : Framework de test
- **React Testing Library** : Test des composants React
- **@testing-library/user-event** : Simulation d'interactions utilisateur

### Tests disponibles

#### 1. Tests de l'Application
**Fichier** : `src/App.test.js`
- Rendu de base de l'application
- Navigation

**Fichier** : `src/App.integration.test.js`
- Tests d'intégration de l'application complète

#### 2. Tests de Connexion
**Fichier** : `src/pages/Login.test.js`
- Formulaire de connexion
- Validation des champs
- Soumission

#### 3. Tests d'Inscription
**Fichier** : `src/pages/Signup.test.js`
- Formulaire d'inscription
- Validation des champs
- Création de compte

#### 4. Tests des Salles
**Fichier** : `src/pages/Rooms.test.js`
- Affichage des salles
- Recherche et filtres
- Gestion CRUD

**Fichier** : `src/pages/Rooms.performance.test.js`
- Tests de performance du rendu

#### 5. Tests des Réservations
**Fichier** : `src/pages/Bookings.test.js`
- Affichage des réservations
- Création de réservation
- Gestion des réservations

**Fichier** : `src/pages/Bookings.integration.test.js`
- Tests d'intégration des réservations

### 🚀 Commandes Frontend

```bash
# Se placer dans le dossier test_logi
cd test_logi

# Installer les dépendances
npm install

# Lancer tous les tests
npm test

# Lancer les tests en mode interactif
npm test -- --watchAll

# Lancer un fichier de test spécifique
npm test -- Login.test.js
npm test -- Signup.test.js
npm test -- Rooms.test.js
npm test -- Bookings.test.js

# Lancer les tests avec couverture de code
npm test -- --coverage --watchAll=false

# Lancer uniquement les tests d'intégration
npm test -- integration.test.js

# Lancer uniquement les tests de performance
npm test -- performance.test.js
```

---

## 🔄 Workflow Complet

### Exécuter tous les tests du projet

```bash
# Terminal 1 - Tests Backend
cd server
npm install
npm test

# Terminal 2 - Tests Frontend
cd test_logi
npm install
npm test
```

### Avant de pousser du code

```bash
# Backend
cd server && npm test -- --coverage

# Frontend
cd test_logi && npm test -- --coverage --watchAll=false

# Tests de performance
cd server && k6 run ./test/performance-test.js
```

---

## 📊 Rapport de Couverture

### Backend
Après `npm test -- --coverage`, le rapport est disponible dans :
```
server/coverage/lcov-report/index.html
```

### Frontend
Après `npm test -- --coverage --watchAll=false`, le rapport est disponible dans :
```
test_logi/coverage/lcov-report/index.html
```

---

## ⚙️ Configuration

### Jest Backend
Configuration dans `server/jest.config.js`

### Jest Frontend
Configuration dans `test_logi/package.json` (section jest/eslintConfig)

---

## 🐛 Dépannage

### Problème : Tests Jest ne se lancent pas
```bash
# Nettoyer le cache Jest
npm test -- --clearCache
```

### Problème : Erreurs de dépendances
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Problème : k6 non trouvé
```bash
# Installer k6 (macOS)
brew install k6

# Vérifier l'installation
k6 version
```

---

## 📝 Bonnes Pratiques

1. **Lancer les tests avant chaque commit**
2. **Maintenir une couverture de code > 80%**
3. **Écrire des tests pour chaque nouvelle fonctionnalité**
4. **Tester les cas d'erreur et les edge cases**
5. **Utiliser des noms de test descriptifs**

---

## 🔗 Ressources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
- [k6 Documentation](https://k6.io/docs/)

---

**Dernière mise à jour** : 14 janvier 2026
