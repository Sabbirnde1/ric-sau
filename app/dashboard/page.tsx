'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from './DashboardContent'; // Your existing dashboard JSX

export default function Dashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'loggedIn') {
      setAuthorized(true);
      setChecking(false);
    } else {
      router.replace('/login'); // Use replace instead of push to prevent back button issues
    }
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return <DashboardContent />;
}
