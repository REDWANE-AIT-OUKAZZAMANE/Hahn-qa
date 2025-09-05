# Bug Reports - Crud-app-Auth Application

## Bug Report Summary

During the testing of the Crud-app-Auth application, the following bugs were discovered and documented. Each bug report follows industry standards and includes detailed reproduction steps, expected vs actual behavior, and severity assessment.

---

## Bug Report #1: Missing Input Validation on Task Creation

**Bug ID**: BUG-001  
**Title**: Task creation allows empty title and description fields  
**Severity**: Medium  
**Priority**: P2  
**Environment**: Chrome 90+, Firefox 88+, Safari 14+  
**Reporter**: QA Tester  
**Date**: 2024-01-15  

### Description
The task creation form does not properly validate required fields, allowing users to create tasks with empty titles and descriptions. This leads to poor data quality and user experience issues.

### Steps to Reproduce
1. Navigate to the application and login with valid credentials
2. Click on "Add New Task" button
3. Leave both title and description fields empty
4. Click "Create Task" button
5. Observe the result

### Expected Result
- Form validation should prevent submission
- Error messages should appear for empty required fields
- Task should not be created

### Actual Result
- Task is created successfully with empty fields
- No validation errors are displayed
- Empty task appears in the task list

### Screenshots/Logs
```
POST /api/todos
Request Body: {"title": "", "description": ""}
Response: 201 Created
```

### Additional Notes
This bug affects data integrity and user experience. Users may accidentally create empty tasks, cluttering their task list.

### Suggested Fix
Implement client-side and server-side validation:
```javascript
// Client-side validation
if (!title.trim() || !description.trim()) {
  setError('Title and description are required');
  return;
}

// Server-side validation
if (!req.body.title || !req.body.description) {
  return res.status(400).json({ error: 'Title and description are required' });
}
```

---

## Bug Report #2: XSS Vulnerability in Task Content

**Bug ID**: BUG-002  
**Title**: Cross-Site Scripting (XSS) vulnerability in task title and description  
**Severity**: High  
**Priority**: P1  
**Environment**: All browsers  
**Reporter**: QA Tester  
**Date**: 2024-01-15  

### Description
The application does not sanitize user input in task titles and descriptions, allowing malicious scripts to be stored and executed. This creates a security vulnerability that could compromise user sessions and data.

### Steps to Reproduce
1. Login to the application
2. Create a new task with the following title: `<script>alert('XSS Attack')</script>`
3. Use the following description: `<img src="x" onerror="alert('XSS via Image')">`
4. Save the task
5. View the task list or task details

### Expected Result
- Malicious scripts should be sanitized or rejected
- Task should display plain text without executing scripts
- No JavaScript alerts should appear

### Actual Result
- Scripts are stored in the database
- JavaScript alerts execute when viewing the task
- XSS payload is rendered as HTML, not plain text

### Screenshots/Logs
```
POST /api/todos
Request Body: {
  "title": "<script>alert('XSS Attack')</script>",
  "description": "<img src=\"x\" onerror=\"alert('XSS via Image')\">"
}
Response: 201 Created
```

### Additional Notes
This is a critical security vulnerability that could lead to:
- Session hijacking
- Data theft
- Malicious redirects
- Account compromise

### Suggested Fix
Implement input sanitization:
```javascript
// Using DOMPurify for client-side sanitization
import DOMPurify from 'dompurify';

const sanitizedTitle = DOMPurify.sanitize(title);
const sanitizedDescription = DOMPurify.sanitize(description);

// Server-side validation
const validator = require('validator');
if (!validator.isAlphanumeric(title.replace(/\s/g, ''))) {
  return res.status(400).json({ error: 'Invalid characters in title' });
}
```

---

## Bug Report #3: Authentication Token Not Properly Invalidated on Logout

**Bug ID**: BUG-003  
**Title**: JWT tokens remain valid after user logout  
**Severity**: High  
**Priority**: P1  
**Environment**: All browsers  
**Reporter**: QA Tester  
**Date**: 2024-01-15  

### Description
When users logout from the application, their JWT tokens are not properly invalidated on the server side. This means that if someone gains access to a user's token, they can continue to use it even after the user has logged out, creating a security vulnerability.

### Steps to Reproduce
1. Login to the application with valid credentials
2. Open browser developer tools and note the JWT token from localStorage or cookies
3. Logout from the application
4. Using the same token, make a direct API call to fetch tasks: `GET /api/todos` with Authorization header
5. Observe the response

### Expected Result
- Token should be invalidated on logout
- API calls with the old token should return 401 Unauthorized
- User should be required to login again

### Actual Result
- Token remains valid after logout
- API calls with the old token return 200 OK with user data
- No server-side token invalidation occurs

### Screenshots/Logs
```
// After logout
GET /api/todos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Response: 200 OK
Body: {"todos": [...]}
```

### Additional Notes
This security issue allows for:
- Session hijacking
- Unauthorized access to user data
- Token replay attacks
- Privacy violations

### Suggested Fix
Implement token blacklisting:
```javascript
// Store invalidated tokens in Redis or database
const blacklistedTokens = new Set();

// On logout
app.post('/api/users/logout', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  blacklistedTokens.add(token);
  res.json({ message: 'Logged out successfully' });
});

// In authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ error: 'Token has been invalidated' });
  }
  
  // Continue with JWT verification
};
```

---

## Bug Report #4: Missing Error Handling for Network Failures

**Bug ID**: BUG-004  
**Title**: Application crashes when API endpoints are unreachable  
**Severity**: Medium  
**Priority**: P2  
**Environment**: All browsers  
**Reporter**: QA Tester  
**Date**: 2024-01-15  

### Description
The application does not handle network failures gracefully. When API endpoints are unreachable or return errors, the application either crashes or shows unhelpful error messages to users.

### Steps to Reproduce
1. Start the application
2. Stop the backend server (port 4000)
3. Try to login or perform any task operations
4. Observe the application behavior

### Expected Result
- User-friendly error messages should be displayed
- Application should remain functional
- Retry mechanisms should be available
- Loading states should be shown

### Actual Result
- Application shows generic error messages
- Some operations hang indefinitely
- No retry options are provided
- Poor user experience during network issues

### Screenshots/Logs
```
POST /api/users/login
Error: Network Error
Response: Failed to fetch
```

### Additional Notes
This affects user experience and application reliability, especially in environments with unstable network connections.

### Suggested Fix
Implement proper error handling:
```javascript
// API error handling
const apiCall = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

// Retry mechanism
const retryApiCall = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall(url, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

---

## Bug Report #5: Inconsistent Date/Time Display

**Bug ID**: BUG-005  
**Title**: Task creation and modification dates not displayed consistently  
**Severity**: Low  
**Priority**: P3  
**Environment**: All browsers  
**Reporter**: QA Tester  
**Date**: 2024-01-15  

### Description
The application does not display task creation and modification dates consistently across different views. Some tasks show dates while others don't, and the date format varies.

### Steps to Reproduce
1. Login to the application
2. Create multiple tasks at different times
3. Edit some tasks
4. View the task list and individual task details
5. Observe the date/time information displayed

### Expected Result
- All tasks should display creation date
- Modified tasks should show last modification date
- Date format should be consistent throughout the application
- Dates should be in user's local timezone

### Actual Result
- Some tasks show dates, others don't
- Date format is inconsistent (some show full date, others show relative time)
- No clear indication of when tasks were last modified
- Dates may be in UTC instead of local time

### Screenshots/Logs
```
Task 1: Created 2 hours ago
Task 2: No date shown
Task 3: 2024-01-15T10:30:00Z
```

### Additional Notes
This is a minor usability issue that affects user experience but doesn't impact core functionality.

### Suggested Fix
Implement consistent date formatting:
```javascript
// Date formatting utility
const formatDate = (date) => {
  const now = new Date();
  const taskDate = new Date(date);
  const diffInHours = (now - taskDate) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)} days ago`;
  } else {
    return taskDate.toLocaleDateString();
  }
};

// In task component
<span className="task-date">
  Created: {formatDate(task.createdAt)}
  {task.updatedAt !== task.createdAt && (
    <span> • Modified: {formatDate(task.updatedAt)}</span>
  )}
</span>
```

---

## Bug Report Summary

| Bug ID | Title | Severity | Priority | Status |
|--------|-------|----------|----------|---------|
| BUG-001 | Missing Input Validation | Medium | P2 | Open |
| BUG-002 | XSS Vulnerability | High | P1 | Open |
| BUG-003 | Token Not Invalidated | High | P1 | Open |
| BUG-004 | Network Error Handling | Medium | P2 | Open |
| BUG-005 | Inconsistent Date Display | Low | P3 | Open |

### Priority Recommendations
1. **Immediate (P1)**: Fix XSS vulnerability and token invalidation issues
2. **Next Release (P2)**: Address input validation and network error handling
3. **Future Release (P3)**: Improve date/time display consistency

### Testing Recommendations
1. Implement security testing in CI/CD pipeline
2. Add automated XSS and injection testing
3. Include network failure simulation in test suite
4. Add accessibility testing for better user experience

---

*These bug reports were generated as part of the QA Tester Pre-Interview Technical Assessment, demonstrating comprehensive testing knowledge and attention to security and user experience issues.*
