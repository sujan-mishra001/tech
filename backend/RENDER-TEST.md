# Testing Database Connectivity on Render

This guide will help you verify that your MongoDB Atlas connection is working properly on Render and that blogs and other content can be properly saved to the database.

## Prerequisites

- Your backend must be deployed on Render
- You must have set up the `MONGODB_URI` environment variable in Render with your MongoDB Atlas connection string

## Method 1: Using the Render Shell

1. Go to your Render dashboard
2. Click on your backend service
3. Go to the "Shell" tab
4. Run the following commands:

```bash
# Test basic database connection
node test-db.js

# Test all content types
node test-all-content.js
```

You should see output showing successful database connection and content creation.

## Method 2: Using the API

You can test by making API requests directly to your backend service. Here's how:

### 1. Create a user account

```bash
curl -X POST https://your-render-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login to get a token

```bash
curl -X POST https://your-render-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response.

### 3. Create a blog post

```bash
curl -X POST https://your-render-backend.onrender.com/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Blog Post",
    "content": "This is a test blog post",
    "summary": "Testing API",
    "tags": ["test", "api"]
  }'
```

### 4. Create a code snippet

```bash
curl -X POST https://your-render-backend.onrender.com/api/snippets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Snippet",
    "description": "A test snippet",
    "code": "console.log(\"Hello World\");",
    "language": "javascript",
    "tags": ["javascript", "test"]
  }'
```

### 5. Verify by retrieving content

```bash
# Get all blogs
curl https://your-render-backend.onrender.com/api/blogs

# Get all snippets
curl https://your-render-backend.onrender.com/api/snippets
```

## Common Issues

1. If you see `MongoDB connection error: connect ECONNREFUSED`, check that your MongoDB Atlas connection string is correct and that your IP has access.

2. If you see `UnhandledPromiseRejectionWarning`, check the specific error message - it often points to issues with database schemas or missing fields.

3. If authentication is failing, ensure your JWT_SECRET environment variable is properly set.

## Helpful MongoDB Atlas Tips

1. Make sure your MongoDB Atlas cluster is properly configured:
   - Database user has the right permissions
   - Network access allows connections from anywhere (or at least from Render's IP ranges)
   - The cluster is active and running

2. Check your connection string format:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```
   Make sure to replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your actual values.

3. If you're still having issues, try the MongoDB Atlas connection test from their dashboard. 