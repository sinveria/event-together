import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_admin?: boolean;
  [key: string]: any;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  [key: string]: any;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  fullDate?: string;
  location?: string;
  organizer?: string;
  price?: number;
  category_name?: string | null;
  maxParticipants?: number;
  [key: string]: any;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  organizer: string;
  membersCount: number;
  upcomingEvents: number;
  tags: string[];
  is_open: boolean;
  current_user_is_member?: boolean;
  events: string[];
  activity: {
    messages: string;
    online: number;
  };
  max_members?: number;
  members_count?: number;
  organizer_name?: string | null;
  event?: {
    title?: string;
  } | null;
  [key: string]: any;
}

const API_BASE_URL = 'http://localhost:8000';

const api: AxiosInstance = axios.create({
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
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/login', `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }),

  register: (userData: RegisterData): Promise<AxiosResponse<User>> =>
    api.post('/auth/register', userData),

  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get('/users/me'),
};

export const userAPI = {
  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get('/users/me'),

  updateProfile: (userData: Partial<User>): Promise<AxiosResponse<User>> =>
    api.put('/users/me', userData),

  deleteProfile: (): Promise<AxiosResponse<void>> =>
    api.delete('/users/me'),
};

export const eventsAPI = {
  getAllEvents: (params: Record<string, any> = {}): Promise<AxiosResponse<any>> =>
    api.get('/events/', { params }),

  getEvent: (id: number | string): Promise<AxiosResponse<any>> =>
    api.get(`/events/${id}`),

  createEvent: (eventData: Record<string, any>): Promise<AxiosResponse<any>> =>
    api.post('/events/', eventData),

  updateEvent: (id: number | string, eventData: Record<string, any>): Promise<AxiosResponse<any>> =>
    api.put(`/events/${id}`, eventData),

  deleteEvent: (id: number | string): Promise<AxiosResponse<void>> =>
    api.delete(`/events/${id}`),
};

export const categoriesAPI = {
  getCategories: (): Promise<AxiosResponse<any>> => api.get('/categories/'),
  createCategory: (categoryData: Record<string, any>): Promise<AxiosResponse<any>> => api.post('/categories/', categoryData),
  updateCategory: (id: number | string, categoryData: Record<string, any>): Promise<AxiosResponse<any>> => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id: number | string): Promise<AxiosResponse<void>> => api.delete(`/categories/${id}`),
};

export const adminAPI = {
  getUsers: (): Promise<AxiosResponse<any>> => api.get('/admin/users'),
  getUser: (id: number | string): Promise<AxiosResponse<any>> => api.get(`/admin/users/${id}`),
  updateUser: (id: number | string, userData: Record<string, any>): Promise<AxiosResponse<any>> => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id: number | string): Promise<AxiosResponse<void>> => api.delete(`/admin/users/${id}`),
  toggleUserActive: (id: number | string): Promise<AxiosResponse<any>> => api.post(`/admin/users/${id}/toggle-active`),

  getEvents: (): Promise<AxiosResponse<any>> => api.get('/admin/events'),
  updateEvent: (id: number | string, eventData: Record<string, any>): Promise<AxiosResponse<any>> => api.put(`/admin/events/${id}`, eventData),
  deleteEvent: (id: number | string): Promise<AxiosResponse<void>> => api.delete(`/admin/events/${id}`),

  getGroups: (): Promise<AxiosResponse<any>> => api.get('/admin/groups'),
  updateGroup: (id: number | string, groupData: Record<string, any>): Promise<AxiosResponse<any>> => api.put(`/admin/groups/${id}`, groupData),
  deleteGroup: (id: number | string): Promise<AxiosResponse<void>> => api.delete(`/admin/groups/${id}`),
  toggleGroupStatus: (id: number | string): Promise<AxiosResponse<any>> => api.post(`/admin/groups/${id}/toggle-status`),

  getCategories: (): Promise<AxiosResponse<any>> => api.get('/categories/'),
  createCategory: (categoryData: Record<string, any>): Promise<AxiosResponse<any>> => api.post('/categories/', categoryData),
  updateCategory: (id: number | string, categoryData: Record<string, any>): Promise<AxiosResponse<any>> => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id: number | string): Promise<AxiosResponse<void>> => api.delete(`/categories/${id}`),
};

export const groupsAPI = {
  getGroups: (): Promise<AxiosResponse<any>> => api.get('/groups/'),
  getGroupsByEvent: (eventId: number | string): Promise<AxiosResponse<any>> => api.get(`/events/${eventId}/groups`),
  createGroup: (groupData: Record<string, any>): Promise<AxiosResponse<any>> => api.post('/groups/', groupData),
  getGroup: (id: number | string): Promise<AxiosResponse<any>> => api.get(`/groups/${id}`),
  updateGroup: (id: number | string, groupData: Record<string, any>): Promise<AxiosResponse<any>> => api.put(`/groups/${id}`, groupData),
  deleteGroup: (id: number | string): Promise<AxiosResponse<void>> => api.delete(`/groups/${id}`),
  joinGroup: (id: number | string): Promise<AxiosResponse<any>> => api.post(`/groups/${id}/join`),
  leaveGroup: (id: number | string): Promise<AxiosResponse<any>> => api.post(`/groups/${id}/leave`),
  checkMembership: (id: number | string): Promise<AxiosResponse<any>> => api.get(`/groups/${id}/check-membership`),
};

export default api;