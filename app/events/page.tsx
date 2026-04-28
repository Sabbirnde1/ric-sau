import prisma from '@/lib/prisma';
import EventCard from '@/components/sections/EventCard';
import { EmptyState } from '@/components/EmptyState';
import MotionWrapper from '@/components/MotionWrapper';
import { motion } from 'framer-motion';

export const revalidate = 300;

export const metadata = {
  title: 'Events | Research & Innovation Center',
  description: 'Join our latest conferences, seminars, and workshops at RIC-SAU.',
};

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      take: 24,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        date: true,
        time: true,
        location: true,
        category: true,
        image: true,
      },
    });
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10">
          <MotionWrapper>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">Upcoming Events</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto px-6">
              Connect with researchers, attend workshops, and stay informed about the latest academic gatherings.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        {events.length === 0 ? (
          <EmptyState 
            title="No events scheduled" 
            description="We're currently planning new events. Check back soon or contact us for more info."
          />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <MotionWrapper key={event.id} delay={index * 0.1}>
                <EventCard event={{ ...event, image: event.image || '' }} />
              </MotionWrapper>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
