'use client';
import React from 'react';
import DashboardLayout from './(Layout)';
import AuthGuard from '@/components/AuthQuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
