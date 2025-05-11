import axios from 'axios';
import config from '../globals/env.config';

// export async function signupUser(name: string ,email: string, password: string) {
//   const response = await axios.post(`${config.be_server}/api/auth`, {
//     name,
//     email,
//     password
//   });

//   console.log(response)

//   if (response.status === 200 && response.data.status === 'ok') {
//     return true;
//   } 
//   return false;
// }

export async function login(email: string, password: string) {
  const response = await axios.post(`${config.be_server}/api/auth`, {
    email,
    password
  });

  console.log(response)

  if (response.status === 200 && response.data.status === 'ok') {
    return true;
  } 
  return false;
}
