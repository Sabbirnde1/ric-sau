"use client";

import { useState } from 'react';
import Link from "next/link";
import { Calendar as CalendarIcon } from 'lucide-react';

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
}

export default function EventCard({ event }: { event: Event }) {
  const [imgError, setImgError] = useState(false);
  const hasValidImage = event.image && event.image.trim() !== '' && !imgError;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="w-full h-48 relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
        {hasValidImage ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CalendarIcon className="w-12 h-12 text-purple-200" />
          </div>
        )}
      </div>
      <div className="p-6">
        <span className="text-sm font-semibold text-purple-600 uppercase">
          {event.category}
        </span>
        <h3 className="text-xl font-bold mt-2 mb-3">{event.title}</h3>
        <p className="text-gray-600 line-clamp-3">{event.description}</p>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>{event.date}</span>
          <span>{event.location}</span>
        </div>

        <Link
          href={`/events/${event.slug}`}
          className="mt-4 inline-block text-blue-600 font-semibold hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
