import api from './api';

export async function doHealthCheck() {
  const response = await api.get(`/api/health_check`, {
    headers: {
      noAuth: true,
    },
  });

  if (response.status === 200 && response.data.status === 'ok') {
    return true;
  } 
  return false;
}
