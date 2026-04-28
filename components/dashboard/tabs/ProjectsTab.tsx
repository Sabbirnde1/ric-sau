'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit3, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ui/image-upload';
import { contentApi } from '@/lib/api-client';
import { shouldUseUnoptimized } from '@/lib/utils';

export default function ProjectsTab() {
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ 
    title: '', description: '', category: '', status: 'Active', lead: '', startDate: '', budget: 0, image: '' 
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getMany('projects');
      setProjects(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch projects', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.category?.toLowerCase().includes(search.toLowerCase()) ||
    item.lead?.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const pagedProjects = filteredProjects.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAdd = async () => {
    if (!projectForm.title) {
      toast({ title: 'Validation Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    
    try {
      await contentApi.create('project', projectForm);
      toast({ title: 'Success', description: 'Project added successfully' });
      setDialogOpen(false);
      setProjectForm({ title: '', description: '', category: '', status: 'Active', lead: '', startDate: '', budget: 0, image: '' });
      fetchProjects();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add project', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await contentApi.delete('project', id);
      toast({ title: 'Deleted', description: 'Project removed' });
      fetchProjects();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ title: item.title, category: item.category, lead: item.lead });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await contentApi.update('project', editingId, editData);
      toast({ title: 'Success', description: 'Project updated' });
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Research Projects</CardTitle>
            <CardDescription>Manage research projects and initiatives</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Project</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add New Project</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Project Title</Label><Input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Enter project title" /></div>
                  <div><Label>Description</Label><Textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} rows={4} placeholder="Detailed project description" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Category</Label><Input value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} placeholder="AI & Healthcare" /></div>
                    <div><Label>Status</Label><Input value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })} placeholder="Active" /></div>
                  </div>
                  <div><Label>Project Lead</Label><Input value={projectForm.lead} onChange={(e) => setProjectForm({ ...projectForm, lead: e.target.value })} placeholder="Dr. John Doe" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Start Date</Label><Input type="date" value={projectForm.startDate} onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })} /></div>
                    <div><Label>Budget (৳)</Label><Input type="number" value={projectForm.budget} onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) })} /></div>
                  </div>
                  <ImageUpload 
                    label="Project Image" 
                    value={projectForm.image} 
                    onChange={(url) => setProjectForm({ ...projectForm, image: url })}
                    enableCrop
                  />
                  <Button onClick={handleAdd} className="w-full">Add Project</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading projects...</p>
        ) : (
          <div className="space-y-4">
            {pagedProjects.map((project) => (
              <div key={project.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {project.image && (
                  <div className="relative w-20 h-20 rounded overflow-hidden shrink-0">
                    <Image src={project.image} alt={project.title} fill sizes="80px" className="object-cover" unoptimized={shouldUseUnoptimized(project.image)} />
                  </div>
                )}
                <div className="flex-1">
                  {editingId === project.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        placeholder="Project title"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={editData.category || ''}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          placeholder="Category"
                        />
                        <Input
                          value={editData.lead || ''}
                          onChange={(e) => setEditData({ ...editData, lead: e.target.value })}
                          placeholder="Project lead"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{project.description?.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{project.category}</span>
                        <span className="text-xs text-gray-500">Lead: {project.lead}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingId === project.id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={saveEdit}>Save</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => startEdit(project)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {projects.length === 0 && <p className="text-center text-gray-500 py-8">No projects yet. Add your first project!</p>}
            {projects.length > 0 && pagedProjects.length === 0 && <p className="text-center text-gray-500 py-8">No projects match your search.</p>}

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
