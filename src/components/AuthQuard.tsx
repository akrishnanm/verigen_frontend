'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StorageUtil } from '@/utils/storage';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = StorageUtil.get('accessToken');

    if (!token) {
      router.replace('/auth/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) return null;

  return <>{children}</>;
};

export default AuthGuard;
