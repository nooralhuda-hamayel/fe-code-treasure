import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LogoutPage() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
        await handleLogout();
        navigate('/login');
    };
    performLogout();
  }, [handleLogout, navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
} 