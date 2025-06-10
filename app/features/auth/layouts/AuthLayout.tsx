import React from 'react';
import Header from '../components/Header';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
} 