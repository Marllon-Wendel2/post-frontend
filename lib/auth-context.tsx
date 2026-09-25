'use client';

import axios from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import api from './api';
import { getCookie, hasCookie, removeCookie, setCookie } from './cookies';
import type { AuthResponseDto, User, UserCreateDto, UserResponseDto } from './types';

interface AuthResult {
  success: boolean;
  message: string;
}

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<AuthResult>;
  refreshToken: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  const clearAuth = useCallback(() => {
    setCurrentUser(null);

    if (typeof window !== 'undefined') {
      removeCookie('natura_token');
      removeCookie('natura_refresh_token');
      localStorage.removeItem('natura_user');
    }
  }, []);

  useEffect(() => {
    const hasToken = hasCookie('natura_token');
    const savedUser = localStorage.getItem('natura_user');

    if (hasToken && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        clearAuth();
      }
    }

    setInitialized(true);
  }, [clearAuth]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const authResponse = await api.post<AuthResponseDto>('/auth/login', {
          email,
          password,
        });

        const { token, refreshToken: newRefreshToken, id } = authResponse.data;

        setCookie('natura_token', token, 1);
        setCookie('natura_refresh_token', newRefreshToken, 7);

        const userResponse = await api.get<UserResponseDto>(`/users/${id}`);
        console.log(userResponse.data)

        const userData = userResponse.data;

        const user: User = {
          id: userData.id,
          name: userData.sellerName,
          email: userData.email,
          phone: userData.phoneNumber,
        };

        setCurrentUser(user);
        localStorage.setItem('natura_user', JSON.stringify(user));

        return { success: true, message: 'Login realizado com sucesso!' };
      } catch (error) {
        const status = axiosStatus(error);

        if (status === 401) {
          return { success: false, message: 'E-mail ou senha incorretos.' };
        }

        if (status === 400) {
          return { success: false, message: 'Dados de entrada inválidos.' };
        }

        return {
          success: false,
          message: 'Erro ao fazer login. Verifique sua conexão.',
        };
      }
    },
    []
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      phone?: string;
      password: string;
    }): Promise<AuthResult> => {
      try {
        const createDto: UserCreateDto = {
          sellerName: data.name,
          email: data.email,
          phoneNumber: data.phone || '',
          password: data.password,
        };

        await api.post('/users', createDto);

        const loginResult = await login(data.email, data.password);

        if (loginResult.success) {
          return { success: true, message: 'Conta criada com sucesso!' };
        }

        return {
          success: false,
          message: 'Conta criada, mas houve erro ao entrar.',
        };
      } catch (error) {
        const status = axiosStatus(error);

        if (status === 409) {
          return { success: false, message: 'Este e-mail já está cadastrado.' };
        }

        if (status === 400) {
          return {
            success: false,
            message:
              'Dados inválidos. Verifique a senha (mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 especial).',
          };
        }

        return { success: false, message: 'Erro ao criar conta.' };
      }
    },
    [login]
  );

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const currentRefreshToken = getCookie('natura_refresh_token');
      if (!currentRefreshToken) return false;

      const response = await api.post<AuthResponseDto>('/auth/refresh', {
        refreshToken: currentRefreshToken,
      });

      const { token, refreshToken: newRefreshToken } = response.data;

      setCookie('natura_token', token, 1);
      setCookie('natura_refresh_token', newRefreshToken, 7);

      return true;
    } catch {
      clearAuth();
      return false;
    }
  }, [clearAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: currentUser,
      isLoggedIn: currentUser !== null,
      initialized,
      login,
      register,
      refreshToken,
      logout,
    }),
    [currentUser, initialized, login, register, refreshToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }

  return context;
}

function axiosStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
}
