import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe, type User } from '../../../../apis';
import { useAuth } from '../../../auth';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { handleLogout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      setError(null);
      setUser(null);
      try {
        const userData = await getMe();
        setUser(userData.user);
      } catch (err) {
        handleLogout();
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
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