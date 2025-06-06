// API client for connecting to the backend
import axios from 'axios';

const API_URL =
  typeof window !== 'undefined'
    ? (window as any).__NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://tech-yb09.onrender.com/api'
        : 'http://localhost:5000/api')
    : process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://tech-yb09.onrender.com/api'
        : 'http://localhost:5000/api');

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookie handling
  validateStatus: status => status < 500, // Don't reject if status is not 2xx
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication
export async function registerUser(userData: { username: string; email: string; password: string }) {
  const response = await api.post('/auth/register', userData);
  if (response.data.success && response.data.user.token) {
    localStorage.setItem('token', response.data.user.token);
  }
  return response.data;
}

export async function loginUser(credentials: { email: string; password: string }) {
  const response = await api.post('/auth/login', credentials);
  if (response.data.success && response.data.user.token) {
    localStorage.setItem('token', response.data.user.token);
  }
  return response.data;
}

export async function logoutUser() {
  const response = await api.post('/auth/logout');
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

export async function updateUserProfile(userData: any) {
  const response = await api.put('/auth/profile', userData);
  return response.data;
}

// Blogs
export async function getBlogs(params: { featured?: boolean; tag?: string; limit?: number; page?: number } = {}) {
  const response = await api.get('/blogs', { params });
  return response.data;
}

export async function getBlog(id: string) {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
}

export async function createBlog(blogData: any) {
  const response = await api.post('/blogs', blogData);
  return response.data;
}

export async function updateBlog(id: string, blogData: any) {
  const response = await api.put(`/blogs/${id}`, blogData);
  return response.data;
}

export async function deleteBlog(id: string) {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
}

export async function getUserBlogs(userId: string) {
  const response = await api.get(`/blogs/user/${userId}`);
  return response.data;
}

// Snippets
export async function getSnippets(params: { featured?: boolean; tag?: string; language?: string; limit?: number; page?: number } = {}) {
  const response = await api.get('/snippets', { params });
  return response.data;
}

export async function getSnippet(id: string) {
  const response = await api.get(`/snippets/${id}`);
  return response.data;
}

export async function createSnippet(snippetData: any) {
  const response = await api.post('/snippets', snippetData);
  return response.data;
}

export async function updateSnippet(id: string, snippetData: any) {
  const response = await api.put(`/snippets/${id}`, snippetData);
  return response.data;
}

export async function deleteSnippet(id: string) {
  const response = await api.delete(`/snippets/${id}`);
  return response.data;
}

// Datasets
export async function getDatasets(params: { featured?: boolean; tag?: string; limit?: number; page?: number } = {}) {
  const response = await api.get('/datasets', { params });
  return response.data;
}

export async function getDataset(id: string) {
  const response = await api.get(`/datasets/${id}`);
  return response.data;
}

export async function uploadDataset(formData: FormData) {
  const response = await api.post('/datasets', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// File uploads
export async function uploadFile(formData: FormData, type: string) {
  const endpoint = `/${type}s`;
  const response = await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Content Statistics
export async function getContentStats() {
  const response = await api.get('/stats/content');
  return response.data;
}

// Files
export async function getFiles(params: { featured?: boolean; tag?: string; limit?: number; page?: number } = {}) {
  const response = await api.get('/files', { params });
  return response.data;
}

export async function getFile(id: string) {
  const response = await api.get(`/files/${id}`);
  return response.data;
}

// Books
export async function getBooks(params: { featured?: boolean; tag?: string; limit?: number; page?: number } = {}) {
  const response = await api.get('/books', { params });
  return response.data;
}

export async function getBook(id: string) {
  const response = await api.get(`/books/${id}`);
  return response.data;
}

// Projects
export async function getProjects(params: { featured?: boolean; tag?: string; limit?: number; page?: number } = {}) {
  const response = await api.get('/jupyter', { params });
  return response.data;
}

export async function getProject(id: string) {
  const response = await api.get(`/jupyter/${id}`);
  return response.data;
}