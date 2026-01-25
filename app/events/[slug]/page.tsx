import { notFound } from "next/navigation";

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

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/content?type=events`, {
      cache: "no-store",
    });
    const json = await res.json();

    if (!json.success) return null;

    const event = json.data.find((e: Event) => e.slug === slug);
    return event || null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export default async function EventDetailsPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug);

  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">{event.title}</h1>
        </div>
      </section>

      {/* Event Details */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="mb-6">
            <span className="text-sm font-semibold text-purple-600 uppercase">
              {event.category}
            </span>
            <h2 className="text-3xl font-bold mt-2">{event.title}</h2>
          </div>

          <p className="text-gray-700 mb-6">{event.description}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">📅 Date</h3>
              <p>{event.date}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">⏰ Time</h3>
              <p>{event.time}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">📍 Location</h3>
              <p>{event.location}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
