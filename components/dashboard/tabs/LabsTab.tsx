'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Search, Edit3 } from 'lucide-react';
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

export default function LabsTab() {
  const { toast } = useToast();
  
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [labForm, setLabForm] = useState({
    name: '', director: '', location: '', established: new Date().getFullYear(),
    members: 0, focus: '', description: '', equipment: '', projects: 0, publications: 0, image: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getMany('lab');
      setLabs(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch labs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const filteredLabs = labs.filter(item => 
    item.name?.toLowerCase().includes(search.toLowerCase()) || 
    item.director?.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredLabs.length / ITEMS_PER_PAGE);
  const pagedLabs = filteredLabs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAdd = async () => {
    if (!labForm.name) {
      toast({ title: 'Validation Error', description: 'Name is required', variant: 'destructive' });
      return;
    }
    
    try {
      const formData = {
        ...labForm,
        focus: labForm.focus ? labForm.focus.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        equipment: labForm.equipment ? labForm.equipment.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      };

      if (editingId) {
        await contentApi.update('lab', editingId, formData);
        toast({ title: 'Success', description: 'Lab updated' });
      } else {
        await contentApi.create('lab', formData);
        toast({ title: 'Success', description: 'Lab added' });
      }
      setDialogOpen(false);
      setEditingId(null);
      setLabForm({ name: '', director: '', location: '', established: new Date().getFullYear(), members: 0, focus: '', description: '', equipment: '', projects: 0, publications: 0, image: '' });
      fetchLabs();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save lab', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lab?')) return;
    try {
      await contentApi.delete('lab', id);
      toast({ title: 'Deleted', description: 'Lab removed' });
      fetchLabs();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setLabForm({
      name: item.name || '',
      director: item.director || '',
      location: item.location || '',
      established: item.established || new Date().getFullYear(),
      members: item.members || 0,
      focus: (item.focus || []).join(', '),
      description: item.description || '',
      equipment: (item.equipment || []).join(', '),
      projects: item.projects || 0,
      publications: item.publications || 0,
      image: item.image || ''
    });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Research Labs</CardTitle>
            <CardDescription>Manage research laboratories</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search labs..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingId(null);
                setLabForm({ name: '', director: '', location: '', established: new Date().getFullYear(), members: 0, focus: '', description: '', equipment: '', projects: 0, publications: 0, image: '' });
              }
            }}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Lab</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingId ? 'Edit Lab' : 'Add New Lab'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Lab Name</Label><Input value={labForm.name} onChange={(e) => setLabForm({ ...labForm, name: e.target.value })} placeholder="AI Research Lab" /></div>
                  <div><Label>Description</Label><Textarea value={labForm.description} onChange={(e) => setLabForm({ ...labForm, description: e.target.value })} rows={4} placeholder="Lab description..." /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Director</Label><Input value={labForm.director} onChange={(e) => setLabForm({ ...labForm, director: e.target.value })} placeholder="Dr. John Doe" /></div>
                    <div><Label>Location</Label><Input value={labForm.location} onChange={(e) => setLabForm({ ...labForm, location: e.target.value })} placeholder="Building A, Floor 3" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label>Established</Label><Input type="number" value={labForm.established} onChange={(e) => setLabForm({ ...labForm, established: Number(e.target.value) })} /></div>
                    <div><Label>Members</Label><Input type="number" value={labForm.members} onChange={(e) => setLabForm({ ...labForm, members: Number(e.target.value) })} /></div>
                    <div><Label>Active Projects</Label><Input type="number" value={labForm.projects} onChange={(e) => setLabForm({ ...labForm, projects: Number(e.target.value) })} /></div>
                  </div>
                  <div><Label>Publications Count</Label><Input type="number" value={labForm.publications} onChange={(e) => setLabForm({ ...labForm, publications: Number(e.target.value) })} /></div>
                  <div><Label>Research Focus (comma-separated)</Label><Input value={labForm.focus} onChange={(e) => setLabForm({ ...labForm, focus: e.target.value })} placeholder="Machine Learning, Deep Learning" /></div>
                  <div><Label>Equipment (comma-separated)</Label><Input value={labForm.equipment} onChange={(e) => setLabForm({ ...labForm, equipment: e.target.value })} placeholder="GPU Clusters, Workstations" /></div>
                  <ImageUpload label="Lab Image" value={labForm.image} onChange={(url) => setLabForm({ ...labForm, image: url })} enableCrop />
                  <Button onClick={handleAdd} className="w-full">{editingId ? 'Save Changes' : 'Add Lab'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading labs...</p>
        ) : (
          <div className="space-y-4">
            {pagedLabs.map((lab: any) => (
              <div key={lab.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {lab.image && (
                  <div className="relative w-20 h-20 rounded overflow-hidden shrink-0">
                    <Image src={lab.image} alt={lab.name} fill sizes="80px" className="object-cover" unoptimized={shouldUseUnoptimized(lab.image)} />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{lab.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{lab.description?.substring(0, 100)}...</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Director: {lab.director}</span>
                    <span className="text-xs text-gray-500">• {lab.members} Members</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(lab)} className="mr-2"><Edit3 className="h-4 w-4" /></Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(lab.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {labs.length === 0 && <p className="text-center text-gray-500 py-8">No labs yet. Add your first lab!</p>}
            {labs.length > 0 && pagedLabs.length === 0 && <p className="text-center text-gray-500 py-8">No labs match your search.</p>}

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
