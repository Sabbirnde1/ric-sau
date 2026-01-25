import MotionWrapper from '@/components/MotionWrapper';

const newsArticles = [
  {
    slug: 'ai-research-breakthrough',
    title: 'AI Research Lab Achieves Breakthrough in Machine Learning',
    date: 'August 25, 2025',
    author: 'Admin',
    content: `
      Our AI Research Lab has developed a novel deep learning architecture 
      that significantly improves image recognition accuracy.
      <br/><br/>
      The project involved extensive training with high-performance GPU clusters, 
      and the results are already being applied in healthcare and smart city projects.
    `,
    image: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    slug: 'security-summit',
    title: 'Cybersecurity Lab Hosts Global Security Summit',
    date: 'August 20, 2025',
    author: 'Dr. Michael Chen',
    content: `
      The Cybersecurity & Privacy Lab successfully hosted an international summit, 
      welcoming researchers from over 30 countries.
      <br/><br/>
      Discussions included next-generation encryption, threat detection, 
      and global cyber cooperation strategies.
    `,
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
  },
];

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function NewsDetailsPage({ params }: { params: { slug: string } }) {
  const article = newsArticles.find((a) => a.slug === params.slug);

  if (!article) {
    return <div className="p-20 text-center">Article not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white text-center">
        <MotionWrapper>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{article.title}</h1>
          <p className="text-blue-100">
            {article.date} • {article.author}
          </p>
        </MotionWrapper>
      </section>

      {/* Content */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <MotionWrapper>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg mb-8"
          />
          <div
            className="prose prose-lg text-gray-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </MotionWrapper>
      </section>
    </div>
  );
}
