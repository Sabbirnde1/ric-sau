'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from './DashboardContent'; // Your existing dashboard JSX

export default function Dashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'loggedIn') {
      setAuthorized(true);
    } else {
      router.push('/login'); // Redirect to login if not authorized
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return <DashboardContent />;
}
