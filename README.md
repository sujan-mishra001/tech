# Data Science Knowledge Hub

A full-stack application for managing and sharing data science resources, such as blog posts, code snippets, datasets, and Jupyter notebooks.

## Project Structure

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: Next.js, React, Tailwind CSS

## Features

- User authentication (register, login, profile management)
- Blog posts management
- Code snippets repository
- Dataset catalog
- File management
- Jupyter notebook projects
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose (optional, for containerized setup)

### Setup

#### Using Docker Compose (Recommended)

1. Clone the repository
2. Start the application using Docker Compose:
   ```
   docker-compose up
   ```
3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

#### Manual Setup

1. Clone the repository

2. Set up the backend:
   ```
   cd backend
   npm install
   ```
   Create a `.env` file based on `.env.sample` and update the MongoDB connection string.
   ```
   npm run dev
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   ```
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   ```
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Deployment

### Backend

The backend can be deployed on Render or any other Node.js hosting platform. The included Dockerfile can be used for containerized deployment.

### Frontend

The frontend is optimized for deployment on Vercel and has been configured as a pure frontend application that can be deployed directly without any backend dependencies.

## License

MIT 