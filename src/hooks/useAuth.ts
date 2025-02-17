'use client';

import { StorageUtil } from '@/utils/storage';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      StorageUtil.remove('accessToken');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return { logout };
};
