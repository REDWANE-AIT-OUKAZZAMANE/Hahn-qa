import request from 'supertest';
import { testData, generateRandomTask } from '../utils/test-data';

const baseUrl = testData.api.baseUrl;
let authToken: string;

describe('Tasks API Tests', () => {
  beforeAll(async () => {
    // Login to get authentication token
    const loginResponse = await request(baseUrl)
      .post(testData.api.endpoints.login)
      .send({
        email: testData.users.valid.existingUser,
        password: testData.users.valid.existingPassword
      });

    if (loginResponse.status === 200) {
      authToken = loginResponse.body.token;
    }
  });

  describe('GET /api/todos', () => {
    test('Get All Tasks with Valid Token', async () => {
      const response = await request(baseUrl)
        .get(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('todos');
      expect(Array.isArray(response.body.todos)).toBe(true);
    });

    test('Get Tasks Without Authentication', async () => {
      const response = await request(baseUrl)
        .get(testData.api.endpoints.tasks);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/todos', () => {
    test('TC006: Create Task with Valid Data', async () => {
      const taskData = generateRandomTask();
      
      const response = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('todo');
      expect(response.body.todo).toHaveProperty('title', taskData.title);
      expect(response.body.todo).toHaveProperty('description', taskData.description);
      expect(response.body.todo).toHaveProperty('completed', false);
      expect(response.body.todo).toHaveProperty('_id');
    });

    test('Create Task with Empty Title', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
          description: testData.tasks.valid.description
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Create Task with Empty Description', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: testData.tasks.valid.title,
          description: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('Create Task Without Authentication', async () => {
      const taskData = generateRandomTask();
      
      const response = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .send(taskData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Create Task with Missing Fields', async () => {
      const response = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: testData.tasks.valid.title
          // Missing description
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/todos/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      // Create a task for testing updates
      const taskData = generateRandomTask();
      const createResponse = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      if (createResponse.status === 201) {
        taskId = createResponse.body.todo._id;
      }
    });

    test('TC007: Update Task with Valid Data', async () => {
      const updatedTask = generateRandomTask();
      
      const response = await request(baseUrl)
        .put(`${testData.api.endpoints.tasks}/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('todo');
      expect(response.body.todo).toHaveProperty('title', updatedTask.title);
      expect(response.body.todo).toHaveProperty('description', updatedTask.description);
    });

    test('Update Task with Invalid ID', async () => {
      const updatedTask = generateRandomTask();
      
      const response = await request(baseUrl)
        .put(`${testData.api.endpoints.tasks}/invalid-id`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedTask);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('Update Task Without Authentication', async () => {
      const updatedTask = generateRandomTask();
      
      const response = await request(baseUrl)
        .put(`${testData.api.endpoints.tasks}/${taskId}`)
        .send(updatedTask);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('Update Task with Empty Fields', async () => {
      const response = await request(baseUrl)
        .put(`${testData.api.endpoints.tasks}/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
          description: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      // Create a task for testing deletion
      const taskData = generateRandomTask();
      const createResponse = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      if (createResponse.status === 201) {
        taskId = createResponse.body.todo._id;
      }
    });

    test('TC008: Delete Task with Valid ID', async () => {
      const response = await request(baseUrl)
        .delete(`${testData.api.endpoints.tasks}/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task deleted successfully');
    });

    test('Delete Task with Invalid ID', async () => {
      const response = await request(baseUrl)
        .delete(`${testData.api.endpoints.tasks}/invalid-id`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('Delete Task Without Authentication', async () => {
      const response = await request(baseUrl)
        .delete(`${testData.api.endpoints.tasks}/${taskId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/todos/:id/complete', () => {
    let taskId: string;

    beforeEach(async () => {
      // Create a task for testing completion
      const taskData = generateRandomTask();
      const createResponse = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      if (createResponse.status === 201) {
        taskId = createResponse.body.todo._id;
      }
    });

    test('TC009: Mark Task as Complete', async () => {
      const response = await request(baseUrl)
        .patch(`${testData.api.endpoints.tasks}/${taskId}/complete`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('todo');
      expect(response.body.todo).toHaveProperty('completed', true);
    });

    test('Mark Task as Complete with Invalid ID', async () => {
      const response = await request(baseUrl)
        .patch(`${testData.api.endpoints.tasks}/invalid-id/complete`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('Mark Task as Complete Without Authentication', async () => {
      const response = await request(baseUrl)
        .patch(`${testData.api.endpoints.tasks}/${taskId}/complete`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Data Validation Tests', () => {
    test('Create Task with XSS Attempt', async () => {
      const maliciousTask = {
        title: '<script>alert("XSS")</script>',
        description: '<img src="x" onerror="alert(\'XSS\')">'
      };

      const response = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`)
        .send(maliciousTask);

      // Should either reject the input or sanitize it
      if (response.status === 201) {
        expect(response.body.todo.title).not.toContain('<script>');
        expect(response.body.todo.description).not.toContain('<img');
      } else {
        expect(response.status).toBe(400);
      }
    });

    test('Create Task with SQL Injection Attempt', async () => {
      const maliciousTask = {
        title: "'; DROP TABLE todos; --",
        description: "1' OR '1'='1"
      };

      const response = await request(baseUrl)
        .post(testData.api.endpoints.tasks)
        .set('Authorization', `Bearer ${authToken}`)
        .send(maliciousTask);

      // Should handle the input safely (either reject or escape)
      expect([200, 201, 400]).toContain(response.status);
    });
  });
});
