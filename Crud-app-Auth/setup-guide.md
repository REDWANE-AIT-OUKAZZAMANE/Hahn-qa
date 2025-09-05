# Complete Setup and Execution Guide

## Prerequisites
- Node.js v14.15.0 or higher
- MongoDB (local or Atlas)
- Git

## Step 1: Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
PROD_MONGO_URI=mongodb://localhost:27017/crudapp
JWT_SECRET=your_jwt_secret_key_for_testing_12345
EMAIL_SECRET=your_email_secret_key_for_testing_67890
NODE_ENV=development
PROD_CLIENT=http://localhost:3000
PORT=4000
EMAIL=test@gmail.com
PASS=testpassword123
```

## Step 2: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## Step 3: Start the Application

### Option A: Manual Start (Recommended for Development)

**Terminal 1 - Backend Server:**
```bash
npm start
```

**Terminal 2 - Frontend Application:**
```bash
cd client
npm start
```

### Option B: Using the Test Scripts

The application will be automatically started when running E2E tests.

## Step 4: Run Tests

### API Tests Only
```bash
npm run test:api
```

### E2E Tests Only
```bash
npm run test:e2e
```

### All Tests
```bash
npm run test:all
```

### Tests with Coverage
```bash
npm run test:coverage
```

### Interactive E2E Tests
```bash
npm run test:e2e:ui
```

## Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Test Credentials**: admin@gmail.com / admin123

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally
- Or update PROD_MONGO_URI to your MongoDB Atlas connection string

### Port Conflicts
- Backend runs on port 4000
- Frontend runs on port 3000
- Make sure these ports are available

### Test Failures
- Ensure both frontend and backend are running for E2E tests
- Check that MongoDB is accessible for API tests
