'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Users, FileText, Briefcase, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  lead: string;
  startDate: string;
  budget: number;
}

interface News {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    status: 'Active',
    lead: '',
    startDate: '',
    budget: 0
  });

  const [newNews, setNewNews] = useState({
    title: '',
    excerpt: '',
    category: '',
    readTime: '3 min read'
  });

  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    position: '',
    department: '',
    email: ''
  });

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, newsRes, teamRes] = await Promise.all([
        fetch('/api/content?type=projects'),
        fetch('/api/content?type=news'),
        fetch('/api/content?type=team')
      ]);

      const projectsData = await projectsRes.json();
      const newsData = await newsRes.json();
      const teamData = await teamRes.json();

      setProjects(projectsData.data || []);
      setNews(newsData.data || []);
      setTeam(teamData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'project', data: newProject })
      });

      if (response.ok) {
        const result = await response.json();
        setProjects([...projects, result.data]);
        setNewProject({
          title: '',
          description: '',
          category: '',
          status: 'Active',
          lead: '',
          startDate: '',
          budget: 0
        });
        setIsProjectDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleAddNews = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'news', data: newNews })
      });

      if (response.ok) {
        const result = await response.json();
        setNews([...news, result.data]);
        setNewNews({
          title: '',
          excerpt: '',
          category: '',
          readTime: '3 min read'
        });
        setIsNewsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding news:', error);
    }
  };

  const handleAddTeamMember = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'team', data: newTeamMember })
      });

      if (response.ok) {
        const result = await response.json();
        setTeam([...team, result.data]);
        setNewTeamMember({
          name: '',
          position: '',
          department: '',
          email: ''
        });
        setIsTeamDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    try {
      const response = await fetch(`/api/content?type=৳{type}&id=৳{id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        switch (type) {
          case 'project':
            setProjects(projects.filter(p => p.id !== id));
            break;
          case 'news':
            setNews(news.filter(n => n.id !== id));
            break;
          case 'team':
            setTeam(team.filter(t => t.id !== id));
            break;
        }
      }
    } catch (error) {
      console.error(`Error deleting ৳{type}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Research Dashboard</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Active research projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">News Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{news.length}</div>
                <p className="text-xs text-muted-foreground">Published articles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.length}</div>
                <p className="text-xs text-muted-foreground">Research team size</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ৳{projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Research funding</p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Research Projects</CardTitle>
                      <CardDescription>Manage active research projects and initiatives</CardDescription>
                    </div>
                    <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Project</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                              id="title"
                              value={newProject.title}
                              onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={newProject.description}
                              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Select onValueChange={(value) => setNewProject({...newProject, category: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AI & Healthcare">AI & Healthcare</SelectItem>
                                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                                  <SelectItem value="IoT & Sustainability">IoT & Sustainability</SelectItem>
                                  <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="lead">Project Lead</Label>
                              <Input
                                id="lead"
                                value={newProject.lead}
                                onChange={(e) => setNewProject({...newProject, lead: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="startDate">Start Date</Label>
                              <Input
                                id="startDate"
                                type="date"
                                value={newProject.startDate}
                                onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="budget">Budget (৳)</Label>
                              <Input
                                id="budget"
                                type="number"
                                value={newProject.budget}
                                onChange={(e) => setNewProject({...newProject, budget: parseInt(e.target.value)})}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddProject}>
                              Add Project
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{project.category}</span>
                            <span>Lead: {project.lead}</span>
                            <span>Budget: ৳{project.budget?.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete('project', project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>News & Updates</CardTitle>
                      <CardDescription>Manage news articles and announcements</CardDescription>
                    </div>
                    <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add News
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add News Article</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="newsTitle">Title</Label>
                            <Input
                              id="newsTitle"
                              value={newNews.title}
                              onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newsExcerpt">Excerpt</Label>
                            <Textarea
                              id="newsExcerpt"
                              value={newNews.excerpt}
                              onChange={(e) => setNewNews({...newNews, excerpt: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newsCategory">Category</Label>
                            <Select onValueChange={(value) => setNewNews({...newNews, category: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Awards">Awards</SelectItem>
                                <SelectItem value="Partnership">Partnership</SelectItem>
                                <SelectItem value="Publication">Publication</SelectItem>
                                <SelectItem value="Event">Event</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsNewsDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddNews}>
                              Add News
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {news.map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{article.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{article.excerpt}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{article.category}</span>
                            <span>{article.date}</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete('news', article.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>Manage research team members and staff</CardDescription>
                    </div>
                    <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Team Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="memberName">Name</Label>
                            <Input
                              id="memberName"
                              value={newTeamMember.name}
                              onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="memberPosition">Position</Label>
                            <Input
                              id="memberPosition"
                              value={newTeamMember.position}
                              onChange={(e) => setNewTeamMember({...newTeamMember, position: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="memberDepartment">Department</Label>
                            <Input
                              id="memberDepartment"
                              value={newTeamMember.department}
                              onChange={(e) => setNewTeamMember({...newTeamMember, department: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="memberEmail">Email</Label>
                            <Input
                              id="memberEmail"
                              type="email"
                              value={newTeamMember.email}
                              onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsTeamDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddTeamMember}>
                              Add Member
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{member.position}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{member.department}</span>
                            <span>{member.email}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete('team', member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}