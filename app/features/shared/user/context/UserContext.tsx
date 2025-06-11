import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getMe, type User } from '../../../../apis';
import { getFromLocalStorage } from '../../../../utils/local-storage.utils';
import { useNavigate } from 'react-router-dom';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate()

  const refetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await getMe();
      setUser(userData.user);
    } catch (err) {
      setUser(null);
      setError(err as Error);
      navigate('/logout')
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const accessToken = getFromLocalStorage('accessToken');
    if (accessToken) {
      refetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 