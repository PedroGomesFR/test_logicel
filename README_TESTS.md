# � Guide Complet : Installation et Tests

Ce guide vous explique étape par étape comment installer le projet sur votre machine locale, le lancer et exécuter tous les tests disponibles.

---

## �️ 1. Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre ordinateur :

*   **Node.js** (Version 14 ou supérieure) : [Télécharger ici](https://nodejs.org/)
*   **MongoDB** (Base de données) : [Télécharger ici](https://www.mongodb.com/try/download/community)
    *   *Assurez-vous que MongoDB est lancé et tourne sur votre machine.*
*   **k6** (Pour les tests de performance) :
    *   **Mac** : `brew install k6`
    *   **Windows** : `choco install k6`
    *   **Linux** : `sudo apt-get install k6`

---

## 📥 2. Installation du Projet

Le projet est divisé en deux parties : le **Server (Backend)** et le **Frontend (React)**. Vous devez installer les dépendances pour les deux.

### Étape 2.1 : Installation du Backend (Server)

Ouvrez votre terminal et exécutez :

```bash
# Aller dans le dossier serveur
cd server

# Installer les librairies
npm install
```

**Configuration (.env) :**
Créez un fichier `.env` dans le dossier `server/` s'il n'existe pas, et ajoutez-y les clés suivantes (exemple) :
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/test_db
JWT_SECRET=mon_super_secret_pour_les_tests
```

### Étape 2.2 : Installation du Frontend (React)

Ouvrez un **nouveau** terminal (ou revenez à la racine) et exécutez :

```bash
# Aller dans le dossier frontend
cd test_logi

# Installer les librairies
npm install
```

---

## 🚀 3. Lancer le Projet

Pour utiliser l'application, vous devez lancer le serveur et le site web en même temps (dans deux terminaux différents).

*   **Terminal 1 (Serveur)** :
    ```bash
    cd server
    npm run dev
    ```
    *Vous devriez voir : "Server running on port 5001" et "MongoDB Connected"*

*   **Terminal 2 (Frontend)** :
    ```bash
    cd test_logi
    npm start
    ```
    *Le site devrait s'ouvrir automatiquement sur `http://localhost:3000`*

---

## 🧪 4. Exécuter les Tests

Voici comment vérifier que tout fonctionne correctement.

### A. Tests Backend (API) ⚙️

Ces tests vérifient que le serveur, la base de données et l'authentification fonctionnent.

```bash
cd server
npm test
```
*Cela lancera Jest et testera l'inscription, la connexion, les chambres et les réservations.*

### B. Tests Frontend (Interface) 🎨

Ces tests vérifient que les pages s'affichent bien et que les boutons fonctionnent.

```bash
cd test_logi
npm test
```
*Appuyez sur `a` pour lancer tous les tests si on vous le demande.*

### C. Tests de Performance (Charge) 📈

Ces tests simulent plusieurs utilisateurs connectés en même temps pour voir si le serveur tient le coup.

**Commande :**
```bash
# Depuis la racine du projet ou le dossier server
k6 run server/test/performance-test.js
```

**Comprendre le résultat :**
*   Regardez la ligne `http_req_duration`.
*   Si `p(95) < 1000ms`, le test est **RÉUSSI** (le serveur répond vite).
*   Si vous voyez des croix rouges ❌, le serveur est trop lent ou a des erreurs.

---

## 🆘 Dépannage Rapide

*   **Erreur "Connection refused"** : Vérifiez que MongoDB est bien lancé !
*   **Erreur "EADDRINUSE"** : Le port 5001 ou 3000 est déjà pris. Coupez les autres terminaux Node.js.
*   **Tests k6 qui échouent** : Assurez-vous que le serveur (`npm run dev` dans `server/`) est ALLUMÉ pendant que vous lancez k6.
