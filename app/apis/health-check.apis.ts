import axios from 'axios';

const serverURL = import.meta.env.VITE_BE_SERVER;

export async function doHealthCheck() {
  const response = await axios.get(`${serverURL}/api/health_check`);

  if (response.status === 200 && response.data.status === 'ok') {
    return true;
  } 
  return false;
}
