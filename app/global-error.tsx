'use client';

import { Inter } from 'next/font/google';
import { Button } from '@/components/ui/button';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Critical System Error</h2>
          <p className="text-lg text-gray-600 max-w-lg mb-8">
            A critical error occurred that prevented the page from loading. 
            We are tracking this issue. Please try refreshing.
          </p>
          <Button onClick={() => reset()} size="lg">
            Refresh Application
          </Button>
        </div>
      </body>
    </html>
  );
}
