// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';
// import type { RootState } from '../../store';

// const AuthRedirect = () => {
//   const { token } = useSelector((state: RootState) => state.auth);
  
//   if (token) {
//     return <Navigate to="/levels" replace />;
//   }
  
//   return <Outlet />;
// };

// export default AuthRedirect;


import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../store';

const AuthRedirect = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // تحقق إضافي لتفادي undefined
  if (user === undefined) {
    return <div>Loading...</div>; // أو أي مؤشر تحميل
  }

  if (user) {
    return <Navigate to="/levels" replace />;
  }

  return <Outlet />;
};

export default AuthRedirect;
