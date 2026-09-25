import axios from 'axios';
import { getCookie, removeCookie } from './cookies';

const api = axios.create({
  timeout: 10000,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie('natura_token');

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
  async (error) => {
    const url = String(error?.config?.url ?? '');
    const isAuthEndpoint = url.includes('/auth/');

    if (error?.response?.status === 401 && !isAuthEndpoint) {
      removeCookie('natura_token');
      removeCookie('natura_refresh_token');

      localStorage.removeItem('natura_user');

      // Reload completo (igual ao interceptor do Angular) limpando todo o estado
      // da página; `replace` evita voltar para uma rota expirada pelo history.
      window.location.replace('/login');
    }

    return Promise.reject(error);
  }
);

export default api;
