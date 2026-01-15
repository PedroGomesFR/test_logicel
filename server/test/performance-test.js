import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';

// Liste de 5 utilisateurs fictifs
const users = [
  { email: 'user1@example.com', password: 'password123' },
  { email: 'user2@example.com', password: 'password123' },
  { email: 'user3@example.com', password: 'password123' },
  { email: 'user4@example.com', password: 'password123' },
  { email: 'user5@example.com', password: 'password123' },
];

export let options = {
  vus: 5, // Maximum 5 utilisateurs virtuels
  duration: '1m', // Test pendant 1 minute
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% des requêtes < 1000ms
  },
};

// Setup function: creates users via signup API and fetches rooms
export function setup() {
  // 1. Fetch available rooms
  const roomsResponse = http.get('http://localhost:5001/api/rooms');
  if (roomsResponse.status !== 200) {
    throw new Error('Failed to fetch rooms');
  }
  const rooms = roomsResponse.json();

  // 2. Create users and get tokens
  const tokens = [];
  for (const user of users) {
    const signupPayload = JSON.stringify({
      name: user.email.split('@')[0],
      email: user.email,
      password: user.password,
    });

    // Attempt login first (in case user already exists)
    let loginPayload = JSON.stringify({
      email: user.email,
      password: user.password,
    });

    let loginResponse = http.post('http://localhost:5001/api/auth/login', loginPayload, {
      headers: { 'Content-Type': 'application/json' },
    });

    // If login fails, try signup
    if (loginResponse.status !== 200) {
      const signupResponse = http.post('http://localhost:5001/api/auth/signup', signupPayload, {
        headers: { 'Content-Type': 'application/json' },
      });
      check(signupResponse, {
        'signup status is 201': (r) => r.status === 201,
      });

      // Login again after signup
      loginResponse = http.post('http://localhost:5001/api/auth/login', loginPayload, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    tokens.push(loginResponse.json().token);
  }

  // Return current time as base for unique dates across test runs
  const startTime = Date.now();
  return { tokens, rooms, startTime };
}

export default function (data) {
  const userIndex = (__VU - 1) % users.length;
  const token = data.tokens[userIndex];

  const rooms = data.rooms;
  if (!rooms || rooms.length === 0) {
    console.error("No rooms available!");
    return;
  }

  const roomIndex = userIndex % rooms.length;
  const room = rooms[roomIndex];

  const times = ['10:00', '11:00', '14:00', '15:00', '16:00'];
  const timeIndex = Math.floor(userIndex / rooms.length) % times.length;
  const time = times[timeIndex];

  // Generate unique date based on iteration to avoid 'Already booked'
  // Start from base time passed from setup() and add iteration days
  const iter = exec.vu.iterationInScenario;
  const distinctDate = new Date(data.startTime);
  distinctDate.setDate(distinctDate.getDate() + iter);
  const dateStr = distinctDate.toISOString().split('T')[0];

  // 1. Login (token déjà obtenu)
  // 2. Réservation avec JWT
  const bookingPayload = JSON.stringify({
    roomId: room._id,
    date: dateStr,
    time: time,
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
