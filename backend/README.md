# Data Science Knowledge Hub Backend

This is the backend API for the Data Science Knowledge Hub, a platform for managing and sharing data science resources.

## Features

- User authentication (register, login, profile management)
- Blog posts management
- Code snippets repository
- Dataset catalog
- File management
- Jupyter notebook projects

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

#### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get a single blog
- `POST /api/blogs` - Create a new blog
- `PUT /api/blogs/:id` - Update a blog
- `DELETE /api/blogs/:id` - Delete a blog

#### Snippets
- `GET /api/snippets` - Get all snippets
- `GET /api/snippets/:id` - Get a single snippet
- `POST /api/snippets` - Create a new snippet
- `PUT /api/snippets/:id` - Update a snippet
- `DELETE /api/snippets/:id` - Delete a snippet

#### Datasets
- `GET /api/datasets` - Get all datasets
- `GET /api/datasets/:id` - Get a single dataset
- `POST /api/datasets` - Create a new dataset
- `PUT /api/datasets/:id` - Update a dataset
- `DELETE /api/datasets/:id` - Delete a dataset

## Deployment

This backend can be deployed on Render using the included Dockerfile.

## License

MIT 