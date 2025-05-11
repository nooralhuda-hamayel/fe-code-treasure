import axios from 'axios';
import config from '../globals/env.config';


export async function getLevels(token: string) {
  const response = await axios.get(`${config.be_server}/api/levels`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 200 && response.data) {
    return response.data;
  } 
  throw response;
}
