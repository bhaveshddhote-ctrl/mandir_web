'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RoleGuard = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Not authorized for this specific route
        router.push('/dashboard');
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        background: '#0F172A',
        color: '#D4601A',
        fontFamily: 'Inter, sans-serif'
      }}>
        Loading Access Control...
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
