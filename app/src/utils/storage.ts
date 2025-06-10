
// export const saveToken = (token: string, refreshToken?: string): void => {
//     localStorage.setItem('accessToken', token); 
//     if (refreshToken) {
//       localStorage.setItem('refreshToken', refreshToken);
//     }
//   };
  
// export const getToken = () => localStorage.getItem('accessToken');
// export const getRefreshToken = () => localStorage.getItem('refreshToken');

// export const setToken = (token: string) => {
//   localStorage.setItem('accessToken', token);
// };

// export const clearToken = () => {
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');
// };

export const setUserData = (user: object) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};