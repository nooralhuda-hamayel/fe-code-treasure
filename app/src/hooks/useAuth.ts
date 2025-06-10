
// // src/hooks/useAuth.ts
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import type { RootState, AppDispatch } from '../../store';
// import { loginUser, logoutUser } from '../features/auth/authThunks';
// import type { User } from "../api/types/authTypes";

// // تعريف الـ hook بدون export داخلي غير ضروري
// const useAuth = () => {
//   const { user,  isLoading, error } = useSelector((state: RootState) => state.auth);
  

//   return {
//     user: user as User | null,
  
//     isLoading,
//     error,
//     // isAuthenticated: !!token,
//     // يمكنك إضافة أي دوال أخرى تحتاجها
//   };
// };

// // تصدير الـ hook كقيمة افتراضية
// export default useAuth;


// import { useSelector } from 'react-redux';
// import type { RootState } from '../../store';
// import type { User } from "../api/types/authTypes";

// // دالة مساعده لجلب التوكن من الكوكيز
// const getTokenFromCookies = () => {
//   const match = document.cookie.match(/(^| )token=([^;]+)/);
//   return match ? match[2] : null;
// };

// const useAuth = () => {
//   const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
//   const token = getTokenFromCookies(); // جلب التوكن من الكوكيز

//   return {
//     user: user as User | null,
//     token,
//     isLoading,
//     error,
//     isAuthenticated: !!token,
//   };
// };

// export default useAuth;
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import type { RootState } from '../../store';
import type { User } from "../api/types/authTypes";

const useAuth = () => {
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // هذه الدالة تعمل فقط على العميل (Client-Side)
    const getTokenFromCookies = () => {
      const match = document.cookie.match(/(^| )token=([^;]+)/);
      return match ? match[2] : null;
    };
    
    setToken(getTokenFromCookies());
  }, []);

  return {
    user: user as User | null,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
  };
};

export default useAuth;