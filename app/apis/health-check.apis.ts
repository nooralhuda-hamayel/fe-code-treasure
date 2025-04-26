import axios from 'axios';
import config from '../../app/globals/config';


export async function doHealthCheck() {
  const response = await axios.get(`${config.be_server}/api/health_check`);

  if (response.status === 200 && response.data.status === 'ok') {
    return true;
  } 
  return false;
}
