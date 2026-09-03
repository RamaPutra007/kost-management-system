import axios from 'axios';

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || '/api',

  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token');

    if (
      token &&
      token !== 'undefined' &&
      token !== 'null'
    ) {
      config.headers.set('Authorization', `Bearer ${token}`);
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
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem('token');

      if (
        window.location.pathname !==
        '/login'
      ) {
        window.location.href =
          '/login';
      }
    }

    return Promise.reject(error);
  }
);