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

export const userAPI = {
  getProfile: () =>
    api.get('/users/me'),
  
  updateProfile: (userData) =>
    api.put('/users/me', userData),
  
  deleteProfile: () =>
    api.delete('/users/me'),
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

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleUserActive: (id) => api.post(`/admin/users/${id}/toggle-active`),

  getEvents: () => api.get('/admin/events'),
  updateEvent: (id, eventData) => api.put(`/admin/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),

  getGroups: () => api.get('/admin/groups'),
  updateGroup: (id, groupData) => api.put(`/admin/groups/${id}`, groupData),
  deleteGroup: (id) => api.delete(`/admin/groups/${id}`),
  toggleGroupStatus: (id) => api.post(`/admin/groups/${id}/toggle-status`),
};

export const groupsAPI = {
  getGroups: () => api.get('/groups/'),
  getGroupsByEvent: (eventId) => api.get(`/events/${eventId}/groups`),
  createGroup: (groupData) => api.post('/groups/', groupData),
  getGroup: (id) => api.get(`/groups/${id}`),
  updateGroup: (id, groupData) => api.put(`/groups/${id}`, groupData),
  deleteGroup: (id) => api.delete(`/groups/${id}`),
  joinGroup: (id) => api.post(`/groups/${id}/join`),
  leaveGroup: (id) => api.post(`/groups/${id}/leave`),
  checkMembership: (id) => api.get(`/groups/${id}/check-membership`),
};

export default api;