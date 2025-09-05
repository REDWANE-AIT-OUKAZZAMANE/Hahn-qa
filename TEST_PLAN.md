# Test Plan - Crud-app-Auth Application

## Project Overview

**Selected Project:** Crud-app-Auth  
**Repository:** https://github.com/jamesoyanna/Crud-app-Auth  
**Live Demo:** https://crud-app-auth.netlify.app

### Why This Project Was Selected

I chose the Crud-app-Auth project for the following reasons:

1. **Full-Stack Architecture**: Complete React frontend with Express.js/Node.js backend
2. **Rich Feature Set**: Authentication, email verification, and CRUD operations
3. **Real-World Complexity**: Task management system with user authentication
4. **Well-Documented**: Clear setup instructions and live demo available
5. **Modern Tech Stack**: React, Redux, Express.js, MongoDB, JWT authentication
6. **Testing Opportunities**: Multiple user flows, form validations, and security features

### Application Features

- User registration with email verification
- Login/logout functionality with JWT authentication
- Task creation, editing, deletion, and completion
- Protected routes and authentication middleware
- Responsive UI with React Bootstrap

---

## 1. Test Scope and Objectives

### Test Scope

**In Scope:**
- User authentication flows (registration, login, logout)
- Task management CRUD operations
- Email verification functionality
- Form validations and error handling
- Protected route access
- UI/UX responsiveness
- API endpoint testing
- Database integration testing

**Out of Scope:**
- Performance testing under high load
- Cross-browser compatibility (limited to Chrome/Firefox)
- Mobile device testing
- Third-party email service testing
- Security penetration testing

### Test Objectives

1. **Functional Testing**: Verify all features work as expected
2. **Security Testing**: Validate authentication and authorization
3. **Integration Testing**: Ensure frontend-backend communication
4. **User Experience Testing**: Validate intuitive user flows
5. **Data Integrity Testing**: Verify CRUD operations maintain data consistency
6. **Error Handling Testing**: Ensure graceful error handling and user feedback

---

## 2. Test Approach

### Manual Testing (30%)
- **Exploratory Testing**: Initial application exploration
- **UI/UX Testing**: Visual design and user experience validation
- **Ad-hoc Testing**: Random testing scenarios
- **Usability Testing**: User flow validation

### Automated Testing (70%)
- **End-to-End Testing**: Complete user journey automation
- **API Testing**: Backend endpoint validation
- **Unit Testing**: Component and function testing
- **Integration Testing**: Frontend-backend integration

### Testing Tools
- **E2E Framework**: Playwright (TypeScript)
- **API Testing**: Supertest + Jest
- **Unit Testing**: Jest + React Testing Library
- **Test Data Management**: Custom test data generators

---

## 3. Test Environment Requirements

### Hardware Requirements
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: Minimum 8GB
- **Storage**: 2GB free space
- **Network**: Internet connection for email verification

### Software Requirements
- **Node.js**: v14.15.0 or higher
- **MongoDB**: Local installation or MongoDB Atlas
- **Browser**: Chrome 90+, Firefox 88+, or Safari 14+
- **Code Editor**: VS Code (recommended)

### Environment Setup
```bash
# Backend Environment Variables
PROD_MONGO_URI=mongodb://localhost:27017/crudapp
JWT_SECRET=your_jwt_secret_key
EMAIL_SECRET=your_email_secret_key
NODE_ENV=development
PROD_CLIENT=http://localhost:3000
PORT=4000
EMAIL=your_email@gmail.com
PASS=your_email_password
```

### Test Data Requirements
- Valid email addresses for registration testing
- Test user accounts with various permission levels
- Sample task data for CRUD operations
- Invalid data sets for negative testing

---

## 4. Test Cases for Critical User Flows

### Authentication Flow Test Cases

#### TC001: Successful User Registration
**Objective**: Verify new user can register with valid information
**Preconditions**: Application is running, no existing user with test email
**Test Steps**:
1. Navigate to registration page
2. Enter valid email address
3. Enter valid password (min 6 characters)
4. Click "Register" button
5. Check email for verification link
6. Click verification link
**Expected Result**: User account created successfully, redirected to login page
**Priority**: High

#### TC002: User Login with Valid Credentials
**Objective**: Verify existing user can login successfully
**Preconditions**: Valid user account exists
**Test Steps**:
1. Navigate to login page
2. Enter valid email address
3. Enter correct password
4. Click "Login" button
**Expected Result**: User logged in successfully, redirected to dashboard
**Priority**: High

#### TC003: Login with Invalid Credentials
**Objective**: Verify system rejects invalid login attempts
**Preconditions**: Application is running
**Test Steps**:
1. Navigate to login page
2. Enter invalid email address
3. Enter incorrect password
4. Click "Login" button
**Expected Result**: Error message displayed, user remains on login page
**Priority**: High

#### TC004: Registration with Invalid Email Format
**Objective**: Verify email validation works correctly
**Preconditions**: Application is running
**Test Steps**:
1. Navigate to registration page
2. Enter invalid email format (e.g., "invalid-email")
3. Enter valid password
4. Click "Register" button
**Expected Result**: Validation error displayed, registration blocked
**Priority**: Medium

#### TC005: Access Protected Routes Without Authentication
**Objective**: Verify protected routes redirect unauthenticated users
**Preconditions**: User not logged in
**Test Steps**:
1. Navigate directly to dashboard URL
2. Attempt to access task management features
**Expected Result**: Redirected to login page
**Priority**: High

### Task Management Flow Test Cases

#### TC006: Create Task with Valid Data
**Objective**: Verify user can create new tasks
**Preconditions**: User is logged in
**Test Steps**:
1. Navigate to dashboard
2. Click "Add New Task" button
3. Enter task title
4. Enter task description
5. Click "Create Task" button
**Expected Result**: Task created successfully, appears in task list
**Priority**: High

#### TC007: Edit Existing Task
**Objective**: Verify user can modify existing tasks
**Preconditions**: User logged in, at least one task exists
**Test Steps**:
1. Navigate to dashboard
2. Click "Edit" button on existing task
3. Modify task title and/or description
4. Click "Update Task" button
**Expected Result**: Task updated successfully, changes reflected in task list
**Priority**: High

#### TC008: Delete Task
**Objective**: Verify user can remove tasks
**Preconditions**: User logged in, at least one task exists
**Test Steps**:
1. Navigate to dashboard
2. Click "Delete" button on existing task
3. Confirm deletion in popup
**Expected Result**: Task removed from list, deletion confirmed
**Priority**: High

#### TC009: Mark Task as Complete
**Objective**: Verify task completion functionality
**Preconditions**: User logged in, at least one incomplete task exists
**Test Steps**:
1. Navigate to dashboard
2. Click checkbox next to incomplete task
3. Verify task status change
**Expected Result**: Task marked as complete, visual indicator updated
**Priority**: Medium

#### TC010: Create Task with Empty Fields
**Objective**: Verify form validation prevents empty task creation
**Preconditions**: User is logged in
**Test Steps**:
1. Navigate to dashboard
2. Click "Add New Task" button
3. Leave title and description fields empty
4. Click "Create Task" button
**Expected Result**: Validation error displayed, task not created
**Priority**: Medium

#### TC011: View Task List
**Objective**: Verify task list displays correctly
**Preconditions**: User logged in, multiple tasks exist
**Test Steps**:
1. Navigate to dashboard
2. Verify all tasks are displayed
3. Check task information accuracy
**Expected Result**: All tasks displayed with correct information
**Priority**: High

#### TC012: Task Persistence After Logout/Login
**Objective**: Verify tasks persist across user sessions
**Preconditions**: User logged in, tasks created
**Test Steps**:
1. Create several tasks
2. Logout from application
3. Login again with same credentials
4. Navigate to dashboard
**Expected Result**: All previously created tasks still visible
**Priority**: High

---

## 5. Risk Assessment and Prioritization

### High Priority Risks
1. **Authentication Bypass**: Unauthorized access to protected routes
2. **Data Loss**: Task deletion without confirmation
3. **Session Management**: JWT token security vulnerabilities
4. **Input Validation**: XSS or injection attacks through task content

### Medium Priority Risks
1. **Email Verification**: Bypass of email verification process
2. **UI Responsiveness**: Poor user experience on different screen sizes
3. **Error Handling**: Unclear error messages to users
4. **Performance**: Slow response times for CRUD operations

### Low Priority Risks
1. **UI Consistency**: Minor styling inconsistencies
2. **Accessibility**: Limited accessibility features
3. **Browser Compatibility**: Issues on older browser versions

### Risk Mitigation Strategies
- **Automated Security Testing**: Regular authentication and authorization tests
- **Data Backup Testing**: Verify data persistence and recovery
- **Input Sanitization Testing**: Validate all user inputs
- **Performance Monitoring**: Track response times and resource usage

---

## 6. Defect Reporting Procedure

### Defect Classification

#### Severity Levels
- **Critical**: Application crash, data loss, security breach
- **High**: Major functionality broken, authentication issues
- **Medium**: Minor functionality issues, UI problems
- **Low**: Cosmetic issues, minor usability problems

#### Priority Levels
- **P1**: Fix immediately (Critical severity)
- **P2**: Fix in next release (High severity)
- **P3**: Fix when possible (Medium severity)
- **P4**: Fix if time permits (Low severity)

### Defect Report Template

```
**Bug ID**: BUG-001
**Title**: [Brief description of the issue]
**Severity**: Critical/High/Medium/Low
**Priority**: P1/P2/P3/P4
**Environment**: [Browser, OS, version]
**Reporter**: [Tester name]
**Date**: [Date discovered]

**Description**:
[Detailed description of the issue]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happens]

**Screenshots/Logs**:
[Attach relevant screenshots or error logs]

**Additional Notes**:
[Any additional information]
```

### Defect Lifecycle
1. **New**: Defect reported
2. **Assigned**: Assigned to developer
3. **In Progress**: Developer working on fix
4. **Fixed**: Fix implemented
5. **Verified**: Fix verified by tester
6. **Closed**: Defect resolved

---

## 7. Test Execution Schedule

### Phase 1: Setup and Smoke Testing (Day 1)
- Environment setup
- Smoke tests for basic functionality
- Authentication flow validation

### Phase 2: Functional Testing (Days 2-3)
- CRUD operations testing
- Form validation testing
- Error handling testing

### Phase 3: Integration Testing (Day 4)
- API endpoint testing
- Database integration testing
- Frontend-backend communication

### Phase 4: Security and Performance Testing (Day 5)
- Authentication security testing
- Input validation testing
- Basic performance testing

### Phase 5: Bug Fixing and Retesting (Days 6-7)
- Bug verification
- Regression testing
- Final validation

---

## 8. Success Criteria

### Test Completion Criteria
- All high-priority test cases executed
- Critical and high-severity bugs fixed
- 95% test case pass rate achieved
- Security vulnerabilities addressed
- Performance benchmarks met

### Release Readiness Criteria
- No critical or high-severity bugs open
- All authentication flows working correctly
- CRUD operations functioning properly
- User experience meets acceptance criteria
- Documentation updated and complete

---

## 9. Test Deliverables

1. **Test Plan Document** (This document)
2. **Automated Test Suite** (Playwright + Jest)
3. **Test Execution Reports**
4. **Bug Reports** (Minimum 3 detailed reports)
5. **Test Summary Report**
6. **Setup and Execution Guide**

---

*This test plan will be executed as part of the QA Tester Pre-Interview Technical Assessment, demonstrating comprehensive testing knowledge and practical application of testing methodologies.*
