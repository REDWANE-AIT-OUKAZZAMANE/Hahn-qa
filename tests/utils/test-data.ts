export const testData = {
  users: {
    valid: {
      email: 'testuser@example.com',
      password: 'testpassword123',
      invalidEmail: 'invalid-email',
      invalidPassword: '123',
      existingUser: 'admin@gmail.com',
      existingPassword: 'admin123'
    }
  },
  tasks: {
    valid: {
      title: 'Test Task Title',
      description: 'This is a test task description for automated testing purposes.',
      updatedTitle: 'Updated Test Task Title',
      updatedDescription: 'This is an updated test task description.'
    },
    invalid: {
      emptyTitle: '',
      emptyDescription: '',
      longTitle: 'A'.repeat(256),
      longDescription: 'B'.repeat(1001)
    }
  },
  api: {
    baseUrl: 'http://localhost:4000',
    endpoints: {
      register: '/api/users/register',
      login: '/api/users/login',
      tasks: '/api/todos',
      verify: '/api/users/verify'
    }
  }
};

export const generateRandomEmail = (): string => {
  const timestamp = Date.now();
  return `testuser${timestamp}@example.com`;
};

export const generateRandomTask = () => ({
  title: `Test Task ${Date.now()}`,
  description: `This is a test task created at ${new Date().toISOString()}`
});
