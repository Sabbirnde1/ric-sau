import { notFound } from "next/navigation";
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { shouldUseUnoptimized } from '@/lib/utils';

export const revalidate = 300;

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string | null;
}

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
    });
    return event || null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: `${event.title} | RIC-SAU Events`,
    description: event.description?.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description || '',
      images: event.image ? [event.image] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const events = await prisma.event.findMany({ select: { slug: true } });
    return events.map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

export default async function EventDetailsPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug);

  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="relative w-full h-[400px] overflow-hidden bg-gradient-to-br from-purple-600 to-blue-700">
        {event.image && event.image.trim() !== '' && (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized={shouldUseUnoptimized(event.image)}
          />
        )}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center px-6">
          {event.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 mb-4 bg-white/20 rounded-full text-sm font-medium">
              <Tag className="w-3 h-3" />{event.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-bold max-w-3xl leading-tight">{event.title}</h1>
        </div>
      </section>

      {/* Event Details */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <p className="text-gray-700 mb-8 text-lg leading-relaxed">{event.description}</p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Date</p>
                <p className="font-semibold">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Time</p>
                <p className="font-semibold">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Location</p>
                <p className="font-semibold">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/events">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
