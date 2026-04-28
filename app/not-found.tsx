import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-gray-100 text-gray-400 p-6 rounded-full mb-6">
        <FileQuestion className="w-16 h-16" />
      </div>
      <h2 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h2>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
      </p>
      <Link href="/">
        <Button size="lg">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
