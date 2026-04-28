'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry or Vercel
    console.error('Runtime error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
      <p className="text-gray-600 max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error has occurred. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go back home
        </Button>
      </div>
    </div>
  );
}
