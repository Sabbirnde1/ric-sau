'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, DollarSign, Users, FileText, Github, ExternalLink, Download,  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  lead: string;
  startDate: string;
  budget: number;
  team: string[];
  technologies: string[];
  publications: number;
  image: string;
}

export default function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  useEffect(() => {
    if (typeof window === 'undefined' || !project) return;

    let disposed = false;

    const runAnimation = async () => {
      const { default: gsap } = await import('gsap');
      if (disposed) return;

      gsap.fromTo('.project-detail',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
      );
    };

    void runAnimation();

    return () => {
      disposed = true;
    };
  }, [project]);

  const fetchProject = async () => {
    try {
      const response = await fetch('/api/content?type=projects');
      const data = await response.json();
      if (data.success) {
        const foundProject = data.data.find((p: Project) => p.id === parseInt(params.id as string));
        setProject(foundProject || null);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/research/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/research/projects">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="secondary">{project.category}</Badge>
                  <Badge variant={project.status === 'Active' ? 'default' : 'outline'}>
                    {project.status}
                  </Badge>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {project.title}
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Project Lead</div>
                      <div className="font-medium">{project.lead}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Start Date</div>
                      <div className="font-medium">{new Date(project.startDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* <DollarSign className="h-5 w-5 text-blue-600" /> */}
                    <span className="h-5 w-5 bold text-blue-600" >৳</span>
                    <div>
                      <div className="text-sm text-gray-500">Budget</div>
                      <div className="font-medium">৳{project.budget.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Publications</div>
                      <div className="font-medium">{project.publications}</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Download Report
                  </Button>
                  <Button variant="outline" size="lg">
                    <Github className="mr-2 h-5 w-5" />
                    View Code
                  </Button>
                  <Button variant="outline" size="lg">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Live Demo
                  </Button>
                </div>
              </div>

              <div className="project-detail">
                <div className="relative w-full h-96 rounded-2xl shadow-2xl overflow-hidden">
                  {project.image && project.image.trim() !== '' ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      unoptimized={project.image.startsWith('data:') || (project.image.startsWith('http') && !project.image.includes('images.pexels.com'))}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="technologies">Technologies</TabsTrigger>
                <TabsTrigger value="publications">Publications</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed mb-6">
                      This research project represents a significant advancement in {project.category.toLowerCase()}, 
                      focusing on innovative solutions that address current challenges in the field. Our team has 
                      been working diligently to develop cutting-edge methodologies and technologies that will 
                      have a lasting impact on the industry.
                    </p>
                    
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Objectives</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                      <li>Develop innovative solutions for real-world challenges</li>
                      <li>Advance the state-of-the-art in {project.category.toLowerCase()}</li>
                      <li>Publish high-quality research papers in top-tier venues</li>
                      <li>Create practical applications and tools for the community</li>
                    </ul>

                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Expected Outcomes</h4>
                    <p className="text-gray-600 leading-relaxed">
                      We anticipate that this project will result in significant contributions to the field, 
                      including novel algorithms, improved methodologies, and practical applications that 
                      can be adopted by industry and academia alike.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Research Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.team.map((member, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {member.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{member}</div>
                          <div className="text-sm text-gray-500">
                            {index === 0 ? 'Project Lead' : 'Research Associate'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technologies" className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Technologies & Tools</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {project.technologies.map((tech, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg text-center">
                        <div className="font-medium text-gray-900">{tech}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Technical Approach</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Our technical approach leverages state-of-the-art tools and methodologies to ensure 
                      robust and scalable solutions. We employ a combination of {project.technologies.slice(0, 3).join(', ')} 
                      and other cutting-edge technologies to achieve our research objectives.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="publications" className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Publications & Outputs</h3>
                  <div className="space-y-6">
                    {Array.from({ length: project.publications }, (_, index) => (
                      <div key={index} className="border-l-4 border-blue-600 pl-6 py-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Research Paper #{index + 1}: Advanced Techniques in {project.category}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          Published in International Conference on {project.category} Research
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>2024</span>
                          <span>•</span>
                          <span>{project.lead} et al.</span>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </div>
  );
}