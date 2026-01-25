export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production, replace with real DB
let mockData = {
  projects: [
    {
      id: 1,
      title: 'Advanced Neural Network Architectures for Medical Diagnosis',
      description: 'Developing state-of-the-art deep learning models that can accurately diagnose medical conditions from medical imaging data with 95% accuracy.',
      category: 'AI & Healthcare',
      status: 'Active',
      lead: 'Dr. Sarah Johnson',
      startDate: '2024-01-15',
      budget: 250000,
      team: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Emily Rodriguez'],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV'],
      publications: 3,
      image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'Quantum-Enhanced Cybersecurity Protocols',
      description: 'Pioneering quantum cryptography solutions to create unbreakable security systems for next-generation digital infrastructure.',
      category: 'Cybersecurity',
      status: 'Active',
      lead: 'Prof. Michael Chen',
      startDate: '2024-02-08',
      budget: 400000,
      team: ['Prof. Michael Chen', 'Dr. Alex Kumar', 'Dr. Lisa Wang'],
      technologies: ['Quantum Computing', 'Cryptography', 'C++', 'Python'],
      publications: 5,
      image: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ],
  news: [
    {
      id: 1,
      title: 'Research Team Wins International AI Innovation Award',
      content: 'Our machine learning research team has been recognized with the prestigious Global AI Innovation Award for their groundbreaking work in medical diagnosis.',
      excerpt: 'Our machine learning research team has been recognized with the prestigious Global AI Innovation Award for their groundbreaking work in medical diagnosis.',
      date: '2024-01-20',
      category: 'Awards',
      author: 'Admin',
      image: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '3 min read'
    }
  ],
  team: [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      position: 'Director of AI Research',
      department: 'Artificial Intelligence',
      email: 'sarah.johnson@research.com',
      bio: 'Dr. Johnson leads our AI research initiatives with over 15 years of experience in machine learning and neural networks.',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
      specializations: ['Machine Learning', 'Deep Learning', 'Medical AI'],
      publications: 45,
      projects: [1]
    }
  ],
  events: [
     {
      id: 1,
      slug: 'ai-conference-2025',
      title: 'International AI Research Conference 2025',
      description:
        'Join world-leading experts to discuss the future of AI and its impact on healthcare, robotics, and sustainability.',
      date: '2025-09-15',
      time: '10:00 AM - 5:00 PM',
      location: 'New York City, USA',
      category: 'Conference',
      image:
        'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 2,
      slug: 'cybersecurity-summit',
      title: 'Global Cybersecurity & Privacy Summit',
      description:
        'A global summit bringing together security researchers, government leaders, and industry professionals.',
      date: '2025-10-05',
      time: '09:00 AM - 6:00 PM',
      location: 'Berlin, Germany',
      category: 'Summit',
      image:
        'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ]
};


// Helper to generate new ID
const generateId = (arr: any[]) => (arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1);

// Admin token check
const checkAdmin = (req: NextRequest) => {
  const token = req.headers.get('x-admin-token');
  return token === 'loggedIn';
};

// -------------------- GET --------------------
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'projects':
        return NextResponse.json({ success: true, data: mockData.projects });
      case 'news':
        return NextResponse.json({ success: true, data: mockData.news });
      case 'team':
        return NextResponse.json({ success: true, data: mockData.team });
      case 'events':
        return NextResponse.json({ success: true, data: mockData.events });
      default:
        return NextResponse.json({ success: true, data: mockData });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}

// -------------------- POST --------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'project':
        const newProject = { id: Date.now(), ...data, team: data.team || [], technologies: data.technologies || [], publications: 0 };
        mockData.projects.push(newProject);
        return NextResponse.json({ success: true, data: newProject });

      case 'news':
        const newNews = { id: Date.now(), ...data, date: new Date().toISOString().split('T')[0], author: 'Admin' };
        mockData.news.push(newNews);
        return NextResponse.json({ success: true, data: newNews });

      case 'team':
        const newMember = { id: Date.now(), ...data, publications: 0, projects: [] };
        mockData.team.push(newMember);
        return NextResponse.json({ success: true, data: newMember });

      case 'event':
        const newEvent = { id: Date.now(), ...data };
        mockData.events.push(newEvent);
        return NextResponse.json({ success: true, data: newEvent });

      default:
        return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to create data' }, { status: 500 });
  }
}

// -------------------- PUT --------------------
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    switch (type) {
      case 'project':
        {
          const index = mockData.projects.findIndex(p => p.id === parseInt(id));
          if (index !== -1) {
            mockData.projects[index] = { ...mockData.projects[index], ...data };
            return NextResponse.json({ success: true, data: mockData.projects[index] });
          }
        }
        break;

      case 'news':
        {
          const index = mockData.news.findIndex(n => n.id === parseInt(id));
          if (index !== -1) {
            mockData.news[index] = { ...mockData.news[index], ...data };
            return NextResponse.json({ success: true, data: mockData.news[index] });
          }
        }
        break;

      case 'team':
        {
          const index = mockData.team.findIndex(t => t.id === parseInt(id));
          if (index !== -1) {
            mockData.team[index] = { ...mockData.team[index], ...data };
            return NextResponse.json({ success: true, data: mockData.team[index] });
          }
        }
        break;

      case 'event':
        {
          const index = mockData.events.findIndex(e => e.id === parseInt(id));
          if (index !== -1) {
            mockData.events[index] = { ...mockData.events[index], ...data };
            return NextResponse.json({ success: true, data: mockData.events[index] });
          }
        }
        break;

      default:
        return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to update data' }, { status: 500 });
  }
}

// -------------------- DELETE --------------------
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ success: false, error: 'Missing type or id' }, { status: 400 });
    }

    switch (type) {
      case 'project':
        mockData.projects = mockData.projects.filter(p => p.id !== parseInt(id));
        break;
      case 'news':
        mockData.news = mockData.news.filter(n => n.id !== parseInt(id));
        break;
      case 'team':
        mockData.team = mockData.team.filter(t => t.id !== parseInt(id));
        break;
      case 'event':
        mockData.events = mockData.events.filter(e => e.id !== parseInt(id));
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to delete data' }, { status: 500 });
  }
}
