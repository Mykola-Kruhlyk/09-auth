'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import Loader from '@/components/Loader/Loader';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearUser } = useAuthStore();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getSession();
        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearUser();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [setUser, clearUser]);

  // Показуємо лоадер тільки на приватних маршрутах під час перевірки
  const isPrivateRoute = pathname?.startsWith('/profile') || pathname?.startsWith('/notes');
  
  if (isChecking && isPrivateRoute) {
    return <Loader />;
  }

  return <>{children}</>;
}