import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', `username=${email}&password=${password}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }),

  register: (userData) =>
    api.post('/auth/register', userData),

  getProfile: () =>
    api.get('/users/me'),
};

export const eventsAPI = {
  getAllEvents: (params = {}) =>
    api.get('/events/', { params }),

  getEvent: (id) =>
    api.get(`/events/${id}`),

  createEvent: (eventData) =>
    api.post('/events/', eventData),

  updateEvent: (id, eventData) =>
    api.put(`/events/${id}`, eventData),

  deleteEvent: (id) =>
    api.delete(`/events/${id}`),
};

export default api;