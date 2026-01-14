import http from 'k6/http';
import { check, sleep } from 'k6';

// Liste de 5 utilisateurs fictifs
const users = [
  { email: 'user1@example.com', password: 'password123' },
  { email: 'user2@example.com', password: 'password123' },
  { email: 'user3@example.com', password: 'password123' },
  { email: 'user4@example.com', password: 'password123' },
  { email: 'user5@example.com', password: 'password123' },
];

// Liste de salles fictives (assumées seedées)
const rooms = [
  { id: '1', name: 'Salle A' },
  { id: '2', name: 'Salle B' },
  { id: '3', name: 'Salle C' },
  { id: '4', name: 'Salle D' },
  { id: '5', name: 'Salle E' },
];

export let options = {
  vus: 5, // Maximum 5 utilisateurs virtuels
  duration: '1m', // Test pendant 1 minute
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% des requêtes < 1000ms
  },
};

// Fonction setup : crée les utilisateurs via l'API signup
export function setup() {
  const tokens = [];
  for (const user of users) {
    const signupPayload = JSON.stringify({
      name: user.email.split('@')[0],
      email: user.email,
      password: user.password,
    });
    const signupResponse = http.post('http://localhost:5001/api/auth/signup', signupPayload, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(signupResponse, {
      'signup status is 201': (r) => r.status === 201,
    });
    // Stocke le token pour teardown
    const loginPayload = JSON.stringify({
      email: user.email,
      password: user.password,
    });
    const loginResponse = http.post('http://localhost:5001/api/auth/login', loginPayload, {
      headers: { 'Content-Type': 'application/json' },
    });
    tokens.push(loginResponse.json().token);
  }
  return { tokens };
}

export default function (data) {
  const userIndex = (__VU - 1) % users.length;
  const user = users[userIndex];
  const room = rooms[userIndex];
  const token = data.tokens[userIndex];

  // 1. Login (token déjà obtenu)
  // 2. Réservation avec JWT
  const bookingPayload = JSON.stringify({
    roomId: room.id,
    date: '2023-12-01',
    time: '10:00',
  });
  const bookingResponse = http.post('http://localhost:5001/api/bookings', bookingPayload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  check(bookingResponse, {
    'booking status is 201': (r) => r.status === 201,
    'booking response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}

// Fonction teardown : supprime les utilisateurs via l'API
export function teardown(data) {
  for (const token of data.tokens) {
    http.del('http://localhost:5001/api/auth/me', null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}
