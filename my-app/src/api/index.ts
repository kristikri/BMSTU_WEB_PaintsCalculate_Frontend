import { Api } from './Api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const api = new Api({
    baseURL: apiBaseUrl,
});

api.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.instance.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);