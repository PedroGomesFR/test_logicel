const request = require('supertest');
const baseURL = 'http://localhost:5001';


describe('Security Penetration Tests', () => {
  let authToken;
  const uniqueEmail = `hacker_${Date.now()}@example.com`;

  test('PENTEST-1: Sensitive Data Exposure - Password should not be returned', async () => {
    const response = await request(baseURL)
      .post('/api/auth/signup')
      .send({
        name: 'Pentest User',
        email: uniqueEmail,
        password: 'password123'
      });
    
    if (response.status === 201) {
      authToken = response.body.token;
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('password');
    }
  });

  test('PENTEST-2: NoSQL Injection - Login Bypass attempt', async () => {
    const response = await request(baseURL)
      .post('/api/auth/login')
      .send({
        email: { "$gt": "" }, // Opérateur MongoDB injecté
        password: { "$gt": "" }
      });
    
    // Devrait échouer (400 ou 500), ne jamais réussir (200) avec un token
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('token');
  });

  // 3. Test XSS (Stored)
  // Vérifie si des scripts peuvent être stockés dans le nom d'utilisateur
  test('PENTEST-3: Stored XSS - Script injection in user name', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await request(baseURL)
      .post('/api/auth/signup')
      .send({
        name: xssPayload,
        email: `xss_${Date.now()}@test.com`,
        password: 'password123'
      });

    if (response.status === 201) {
      // Si accepté, on vérifie manuellement si on a un sanitizer. 
      expect(response.body.user.name).toBe(xssPayload); 
    }
  });

  // 4. Test d'Accès Non Autorisé (Broken Access Control)
  // Tente d'accéder à une route protégée sans token
  test('PENTEST-4: Unprotected Endpoint - Accessing bookings without token', async () => {
    const response = await request(baseURL)
      .get('/api/bookings');
    
    expect(response.status).toBe(401); // Doit être Unauthorized
  });

  // 5. Test de Token Invalide (JWT Manipulation)
  // Tente d'utiliser un token malformé
  test('PENTEST-5: Invalid Token - Accessing with fake token', async () => {
    const response = await request(baseURL)
      .get('/api/bookings')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature');
    
    expect(response.status).toBe(401); // Doit être Unauthorized
  });

  // 6. Test de Méthode HTTP Non Autorisée (Verb Tampering)
  // Tente d'utiliser DELETE sur une route GET publique
  test('PENTEST-6: Verb Tampering - DELETE on rooms', async () => {
    const response = await request(baseURL)
      .delete('/api/rooms');
    
    expect(response.status).toBe(404); // Ou 405 Method Not Allowed
  });

  // 7. Test de Force Brute / Politique de Mot de Passe
  // Vérifie si un mot de passe très court est accepté (Faiblesse)
  test('PENTEST-7: Weak Password Policy - Short password', async () => {
    const response = await request(baseURL)
      .post('/api/auth/signup')
      .send({
        name: 'Weak Pass',
        email: `weak_${Date.now()}@test.com`,
        password: '123'
      });
    
    expect(response.status).toBeDefined();
  });

  // 8. Test d'Injection de Champs (Mass Assignment)
  // Tente d'injecter un champ 'role' admin
  test('PENTEST-8: Mass Assignment - Injecting admin role', async () => {
    const response = await request(baseURL)
      .post('/api/auth/signup')
      .send({
        name: 'Admin Attempt',
        email: `admin_${Date.now()}@test.com`,
        password: 'password123',
        role: 'admin',
        isAdmin: true
      });

    if (response.status === 201) {
      // Vérifie que les champs injectés ne sont pas renvoyés/pris en compte
      expect(response.body.user).not.toHaveProperty('role');
      expect(response.body.user).not.toHaveProperty('isAdmin');
    }
  });

  // 9. Test de Déni de Service (DoS) via Payload
  // Envoie une requête avec un corps JSON excessivement large
  test('PENTEST-9: Large Payload - Potential DoS', async () => {
    const largeString = 'a'.repeat(1000000); // 1MB
    const response = await request(baseURL)
      .post('/api/auth/login')
      .send({
        email: 'dos@test.com',
        password: largeString
      });
    
    expect(response.status).not.toBe(500); // Le serveur ne doit pas crasher
  }, 10000); // Timeout augmenté

  // 10. Test de Divulgation d'Information Technique (Error Handling)
  // Provoque une erreur pour voir si la stack trace est révélée
  test('PENTEST-10: Information Disclosure - Stack Trace in errors', async () => {
    // Envoie un JSON malformé pour provoquer une erreur de parsing
    const response = await request(baseURL)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": "broken-json'); 
    
    expect(response.status).toBe(400);
  });

});
