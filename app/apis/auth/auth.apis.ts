import { saveToLocalStorage } from '../../utils/local-storage.utils';
import api from '../api';
import type { GetMeResponse } from './auth.apis.types';

export async function login(email: string, password: string) {
  const response = await api.post(`/api/auth`, {
    email,
    password
  }, {
    headers: {
      noAuth: true,
    }
  });

  if (response.status === 200 && response.data) {
    return response.data as {
      access_token: string
    };
  }
  
  throw response;
}

export async function refreshToken() {
  const response = await api.get('/api/auth/refresh');

  if (response.status === 200 && response.data) {
    const data = response.data as {
      access_token: string
    };
    saveToLocalStorage('accessToken', data.access_token);
    return data;
  }

  throw response;
}

export async function logout() {
  await api.post('/api/auth/logout');
}

export async function getMe() {
  const response = await api.get('/api/auth/me');
  if (response.status === 200 && response.data) {
    return response.data as GetMeResponse;
  }

  throw response;
} 