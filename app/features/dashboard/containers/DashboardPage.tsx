import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../shared/user/context/UserContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (user) {
      if (user.user_type === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/levels');
      }
    } else {
      // Handle case where there is no user, maybe redirect to login
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Redirecting...</p>
    </div>
  );
} 