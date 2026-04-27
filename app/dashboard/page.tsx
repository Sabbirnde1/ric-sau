'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Middleware handles auth, we just ensure client side is mounted 
    // to avoid hydration mismatch with local storage data in DashboardContent
    setMounted(true);
    
    // Fallback UI check just in case localStorage was cleared manually
    if (!localStorage.getItem('adminUser')) {
      router.replace('/login');
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return <DashboardContent />;
}
