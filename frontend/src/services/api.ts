import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('pb_user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// Auth
export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const signupUser = (data: {
  name: string; email: string; password: string;
  college: string; course: string; phone: string;
}) => api.post('/auth/register', data);

// Projects
export const fetchProjects = () => api.get('/projects');
export const submitProject = (data: FormData) =>
  api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProjectStatus = (id: string, status: string) =>
  api.patch(`/projects/${id}`, { status });

// Profile
export const fetchProfile = () => api.get('/profile');
export const updateProfile = (data: Record<string, string>) =>
  api.put('/profile', data);

// Admin
export const fetchAllProjects = () => api.get('/admin/projects');

export default api;
