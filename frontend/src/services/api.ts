import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

export type UserRole = 'guest' | 'user' | 'moderator' | 'admin';

export interface User {
  id: number;
  email: string;
  username?: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_admin?: boolean;
  [key: string]: any;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
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

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh_token = localStorage.getItem('refresh_token');

      if (!refresh_token) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token
        });

        const { access_token, refresh_token: new_refresh_token } = response.data as LoginResponse;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', new_refresh_token);

        processQueue(null, access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },

  register: (userData: RegisterData): Promise<AxiosResponse<User>> =>
    api.post('/auth/register', userData),

  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/me'),

  logout: (refresh_token: string): Promise<AxiosResponse<any>> =>
    api.post('/auth/logout', { refresh_token }),

  refreshToken: (refresh_token: string): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/refresh', { refresh_token }),
};

export const userAPI = {
  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get('/users/me'),

  updateProfile: (userData: Partial<User>): Promise<AxiosResponse<User>> =>
    api.put('/users/me', userData),

  deleteProfile: (): Promise<AxiosResponse<void>> =>
    api.delete('/users/me'),

  uploadAvatar: (formData: FormData): Promise<AxiosResponse<{ avatar_url: string }>> =>
    api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  deleteAvatar: (): Promise<AxiosResponse<{ message: string }>> =>
    api.delete('/users/me/avatar'),
};

export const eventsAPI = {
  getAllEvents: (params: {
    skip?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    sort_by?: 'date' | 'price' | 'title' | 'created_at';
    order?: 'asc' | 'desc';
    price_min?: number;
    price_max?: number;
    date_from?: string;
    date_to?: string;
  } = {}): Promise<AxiosResponse<{
    items: Event[];
    total: number;
    skip: number;
    limit: number;
  }>> => api.get('/events/', { params }),

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

  updateUserRole: (userId: number, role: UserRole): Promise<AxiosResponse<any>> =>
    api.patch(`/admin/users/${userId}/role`, null, { params: { new_role: role } }),

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