import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('sessionToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (payload: {
  email: string;
  password: string;
  publicKey: string;
  encryptedPrivateKey: string;
  kdfSalt: string;
  privateKeyIv: string;
}) => {
  try {
    return await api.post('/auth/register', payload);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || `Registration failed with status ${error.response?.status}`);
    }
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const getContacts = async () => {
  return api.get('/api/contacts');
};

export const searchUsers = async (query: string) => {
  return api.get(`/api/users/search?q=${query}`);
};

export const sendMessage = async (message: any) => {
  return api.post('/api/chat/send', message);
};

export const getMessages = async (contactEmail: string) => {
  return api.get(`/api/chat/history?contact=${encodeURIComponent(contactEmail)}`);
};
