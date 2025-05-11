import axios from 'axios';
import config from '../globals/env.config';

export async function login(email: string, password: string) {
  const response = await axios.post(`${config.be_server}/api/auth`, {
    email,
    password
  });

  if (response.status === 200 && response.data) {
    return response.data as {
      access_token: string
    };
  }
  
  throw response;
}
