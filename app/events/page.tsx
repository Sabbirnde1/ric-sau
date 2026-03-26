import prisma from '@/lib/prisma';
import EventCard from '@/components/sections/EventCard';

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

export default async function EventsPage() {
  const events = await prisma.event.findMany({
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-lg text-blue-100">
          Stay informed about our latest conferences, seminars, and workshops.
        </p>
      </section>

      {/* Events Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={{ ...event, image: event.image || '' }} />
        ))}
      </section>
    </div>
  );
}
