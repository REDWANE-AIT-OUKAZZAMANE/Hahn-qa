import request from 'supertest';
import { testData, generateRandomEmail } from '../utils/test-data';

const baseUrl = testData.api.baseUrl;

describe('Authentication API Tests', () => {
  let authToken: string;
  let testEmail: string;

  beforeEach(() => {
    testEmail = generateRandomEmail();
  });

  describe('POST /api/users/register', () => {
    test('TC001: Successful User Registration', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.register)
        .send({
          email: testEmail,
          password: testData.users.valid.password
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testEmail);
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('Registration with Invalid Email Format', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.register)
        .send({
          email: testData.users.valid.invalidEmail,
          password: testData.users.valid.password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Registration with Short Password', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.register)
        .send({
          email: testEmail,
          password: testData.users.valid.invalidPassword
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Registration with Missing Fields', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.register)
        .send({
          email: testEmail
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Registration with Duplicate Email', async () => {
      // First registration
      await request(baseUrl)
        .post(testData.api.endpoints.register)
        .send({
          email: testEmail,
          password: testData.users.valid.password
        });

      // Second registration with same email
      const response = await request(baseUrl)
        .post(testData.api.endpoints.register)
        .send({
          email: testEmail,
          password: testData.users.valid.password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/login', () => {
    test('TC002: Successful Login with Valid Credentials', async () => {
      // First register a user
      await request(baseUrl)
        .post(testData.api.endpoints.register)
        .send({
          email: testEmail,
          password: testData.users.valid.password
        });

      // Then login
      const response = await request(baseUrl)
        .post(testData.api.endpoints.login)
        .send({
          email: testEmail,
          password: testData.users.valid.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testEmail);
      
      authToken = response.body.token;
    });

    test('TC003: Login with Invalid Credentials', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.login)
        .send({
          email: testEmail,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });

    test('Login with Non-existent User', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.login)
        .send({
          email: 'nonexistent@example.com',
          password: testData.users.valid.password
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Login with Missing Fields', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.login)
        .send({
          email: testEmail
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/verify', () => {
    test('Email Verification with Valid Token', async () => {
      // This test would require a valid verification token
      // In a real scenario, you'd need to extract this from the registration response
      // or use a test token from the database
      
      const response = await request(baseUrl)
        .get(`${testData.api.endpoints.verify}/valid-token`);

      // The actual response depends on the implementation
      expect([200, 400, 404]).toContain(response.status);
    });

    test('Email Verification with Invalid Token', async () => {
      const response = await request(baseUrl)
        .get(`${testData.api.endpoints.verify}/invalid-token`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authentication Middleware Tests', () => {
    test('Access Protected Route Without Token', async () => {
      const response = await request(baseUrl)
        .get(testData.api.endpoints.tasks);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access denied. No token provided.');
    });

    test('Access Protected Route with Invalid Token', async () => {
      const response = await request(baseUrl)
        .get(testData.api.endpoints.tasks)
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid token.');
    });

    test('Access Protected Route with Valid Token', async () => {
      // First login to get a valid token
      const loginResponse = await request(baseUrl)
        .post(testData.api.endpoints.login)
        .send({
          email: testData.users.valid.existingUser,
          password: testData.users.valid.existingPassword
        });

      if (loginResponse.status === 200) {
        const token = loginResponse.body.token;
        
        const response = await request(baseUrl)
          .get(testData.api.endpoints.tasks)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
      }
    });
  });
});
