# Data Science Hub

A comprehensive platform for organizing and accessing data science resources, code snippets, and projects.

## Deployment Guide

### Consolidating to a Single Vercel App

To avoid deployment issues with multiple Vercel instances, follow these steps:

1. **Clean up existing deployments**:
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Delete any duplicate deployments of this app
   - Keep only one deployment with a proper name (e.g., `data-science-hub`)

2. **Set up the deployment**:
   ```bash
   # Navigate to the frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Deploy using our helper script
   node deploy.js
   ```

3. **Configure environment variables**:
   - Ensure all environment variables are set correctly in Vercel
   - You can import them from `.env` and `.env.ai-features`
   - Make sure the `NEXT_PUBLIC_API_URL` points to your Render backend

4. **Set a custom domain (optional)**:
   - Go to your project settings in Vercel
   - Add a custom domain if desired
   - Update the `CLIENT_URL` in your backend `.env` to match

### Backend Deployment on Render

Make sure your backend on Render has:
1. The correct MongoDB Atlas connection string
2. Proper CORS settings for your Vercel domain
3. All required environment variables from `.env`

## Development Setup

```bash
# Clone the repository
git clone <repository-url>

# Setup frontend
cd frontend
npm install
npm run dev

# Setup backend (in another terminal)
cd backend
npm install
npm run dev
```

## Features

- User authentication and authorization
- Content organization (blogs, snippets, datasets, files)
- AI-powered content recommendations
- Content filtering and search
- File uploads and management

## Technologies

- **Frontend**: Next.js, TailwindCSS, React
- **Backend**: Node.js, Express, MongoDB
- **Deployment**: Vercel (frontend), Render (backend)
- **AI Features**: Enabled via environment variables

## Project Structure

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: Next.js, React, Tailwind CSS

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

## License

MIT 