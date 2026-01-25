import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MotionWrapper from '@/components/MotionWrapper';

const newsArticles = [
  {
    id: 1,
    title: 'AI Research Lab Achieves Breakthrough in Machine Learning',
    author: 'Admin',
    date: 'August 25, 2025',
    summary:
      'Our AI Research Lab team has developed a novel deep learning architecture that significantly improves image recognition accuracy.',
    image:
      'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: '/news/ai-research-breakthrough',
  },
  {
    id: 2,
    title: 'Cybersecurity Lab Hosts Global Security Summit',
    author: 'Dr. Michael Chen',
    date: 'August 20, 2025',
    summary:
      'The Cybersecurity & Privacy Lab successfully hosted an international summit bringing together top security researchers worldwide.',
    image:
      'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
    link: '/news/security-summit',
  },
  {
    id: 3,
    title: 'IoT Lab Launches Smart City Pilot Project',
    author: 'Emily Rodriguez',
    date: 'August 15, 2025',
    summary:
      'Our IoT & Smart Systems Lab launched a smart city pilot focusing on energy efficiency, traffic monitoring, and urban sustainability.',
    image:
      'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: '/news/smart-city-project',
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white text-center">
        <MotionWrapper>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Latest News & Updates</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Stay updated with our latest research breakthroughs, events, and achievements.
          </p>
        </MotionWrapper>
      </section>

      {/* News List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article, index) => (
            <MotionWrapper key={article.id} delay={index * 0.2}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{article.author}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 flex-1">{article.summary}</p>
                  <div className="pt-6">
                    <Link href={article.link}>
                      <Button className="w-full flex items-center justify-center">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </section>
    </div>
  );
}
