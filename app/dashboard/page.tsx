'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from './DashboardContent';

import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return <DashboardContent />;
}
