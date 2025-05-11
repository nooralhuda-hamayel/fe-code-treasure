
// // import { useSelector } from 'react-redux';
// // import { Navigate, Outlet } from 'react-router-dom';
// // import type { RootState } from '../../store';

// // export const ProtectedRoute = () => {
// //   const { user } = useSelector((state: RootState) => state.auth);
// //   return user ? <Outlet /> : <Navigate to="/auth" replace />;
// // };


// // import React from 'react';
// // import { Navigate } from 'react-router-dom';

// // const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
// //   const isAuthenticated = false; // تحقق من حالة تسجيل الدخول هنا

// //   if (!isAuthenticated) {
// //     return <Navigate to="/auth" replace />;
// //   }

// //   return children;
// // };

// // export default ProtectedRoute;

// // import React from 'react';
// // import { Navigate } from 'react-router-dom';

// // interface ProtectedRouteProps {
// //   children: React.ReactNode;
// // }

// // const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
// //   const isAuthenticated = false; // Replace with your actual auth check

// //   if (!isAuthenticated) {
// //     return <Navigate to="/auth" replace />;
// //   }

// //   return <>{children}</>;
// // };

// // export default ProtectedRoute;

// // src/utils/protectedRoute.tsx
// import React from 'react';
// import { useSelector } from 'react-redux';
// // import { RootState } from '../redux/store';
// import type { RootState } from '../../store';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
//   if (isAuthenticated === undefined) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/auth" replace />;
//   }

//   return children;
// };
// export default ProtectedRoute;


import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store.ts';

import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (isAuthenticated === undefined) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
