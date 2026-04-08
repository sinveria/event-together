import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, User, AuthResponse, RegisterData, LoginResponse } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }

    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authAPI.login(email, password);
      const { access_token, refresh_token } = response.data as LoginResponse;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      const userResponse = await authAPI.getProfile();
      setUser(userResponse.data);

      return { success: true };
    } catch (error) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      const errorMessage = axiosError.response?.data?.detail || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      const errorMessage = axiosError.response?.data?.detail || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    const refresh_token = localStorage.getItem('refresh_token');
    
    if (refresh_token) {
      try {
        await authAPI.logout(refresh_token);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateUser = (data: Partial<User>): void => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };
  
  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}