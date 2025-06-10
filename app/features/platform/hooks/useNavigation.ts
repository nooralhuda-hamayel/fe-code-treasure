import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useUser } from '../../shared';
import { publicPaths } from '../../../routes';
import { useAuth } from '../../auth';

export function useNavigation() {
  const { isLoading, error } = useUser();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) {
      return; // Wait for user data to be loaded
    }

    const isPublicPath = publicPaths.includes(location.pathname);

    if (!isPublicPath && (!isLoggedIn() || error) ) {
        navigate('/login');
    }
  }, [isLoading, error, location.pathname]);
} 