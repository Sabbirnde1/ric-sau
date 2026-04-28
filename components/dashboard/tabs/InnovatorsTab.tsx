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

export default function InnovatorsTab() {
  const { toast } = useToast();
  
  const [innovators, setInnovators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [innovatorForm, setInnovatorForm] = useState({ 
    name: '', title: '', bio: '', specialization: '', image: '', achievements: '', ripd: '', pi: '', coPi: '', category: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchInnovators = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getMany('innovators');
      setInnovators(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch innovators', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInnovators();
  }, []);

  const filteredInnovators = innovators.filter(item => 
    item.name?.toLowerCase().includes(search.toLowerCase()) || 
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.ripd?.toLowerCase().includes(search.toLowerCase()) ||
    item.pi?.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredInnovators.length / ITEMS_PER_PAGE);
  const pagedInnovators = filteredInnovators.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAdd = async () => {
    if (!innovatorForm.name && !innovatorForm.title) {
      toast({ title: 'Validation Error', description: 'Name or Title is required', variant: 'destructive' });
      return;
    }
    
    try {
      if (editingId) {
        await contentApi.update('innovator', editingId, innovatorForm);
        toast({ title: 'Success', description: 'Innovation updated' });
      } else {
        await contentApi.create('innovator', innovatorForm);
        toast({ title: 'Success', description: 'Innovation added' });
      }
      setDialogOpen(false);
      setEditingId(null);
      setInnovatorForm({ name: '', title: '', bio: '', specialization: '', image: '', achievements: '', ripd: '', pi: '', coPi: '', category: '' });
      fetchInnovators();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save innovation', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this innovation?')) return;
    try {
      await contentApi.delete('innovator', id);
      toast({ title: 'Deleted', description: 'Innovation removed' });
      fetchInnovators();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setInnovatorForm({
      name: item.name || '',
      title: item.title || '',
      bio: item.bio || '',
      specialization: item.specialization || '',
      image: item.image || '',
      achievements: item.achievements || '',
      ripd: item.ripd || '',
      pi: item.pi || '',
      coPi: item.coPi || '',
      category: item.category || ''
    });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Innovators & Innovations</CardTitle>
            <CardDescription>Manage innovations with RIPD codes, PI, and Co-PI details</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search innovations..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingId(null);
                setInnovatorForm({ name: '', title: '', bio: '', specialization: '', image: '', achievements: '', ripd: '', pi: '', coPi: '', category: '' });
              }
            }}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Innovation</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingId ? 'Edit Innovation' : 'Add Innovation'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>RIPD Code</Label><Input value={innovatorForm.ripd} onChange={(e) => setInnovatorForm({ ...innovatorForm, ripd: e.target.value })} placeholder="AGRI-2024-001" /></div>
                    <div><Label>Category</Label><Input value={innovatorForm.category} onChange={(e) => setInnovatorForm({ ...innovatorForm, category: e.target.value })} placeholder="AGRI, TECH, BIO, etc." /></div>
                  </div>
                  <div><Label>Innovation Title</Label><Input value={innovatorForm.title} onChange={(e) => setInnovatorForm({ ...innovatorForm, title: e.target.value })} placeholder="Smart Irrigation System" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Principal Investigator (PI)</Label><Input value={innovatorForm.pi} onChange={(e) => setInnovatorForm({ ...innovatorForm, pi: e.target.value })} placeholder="Dr. Jane Smith" /></div>
                    <div><Label>Co-PI</Label><Input value={innovatorForm.coPi} onChange={(e) => setInnovatorForm({ ...innovatorForm, coPi: e.target.value })} placeholder="Dr. John Doe" /></div>
                  </div>
                  <div><Label>Innovator Name</Label><Input value={innovatorForm.name} onChange={(e) => setInnovatorForm({ ...innovatorForm, name: e.target.value })} placeholder="Dr. Jane Smith" /></div>
                  <div><Label>Specialization</Label><Input value={innovatorForm.specialization} onChange={(e) => setInnovatorForm({ ...innovatorForm, specialization: e.target.value })} placeholder="Agricultural Technology" /></div>
                  <div><Label>Bio / Description</Label><Textarea value={innovatorForm.bio} onChange={(e) => setInnovatorForm({ ...innovatorForm, bio: e.target.value })} rows={3} /></div>
                  <div><Label>Achievements (comma-separated)</Label><Textarea value={innovatorForm.achievements} onChange={(e) => setInnovatorForm({ ...innovatorForm, achievements: e.target.value })} rows={2} placeholder="Award 2023, 10+ Patents" /></div>
                  <ImageUpload 
                    label="Innovation Image" 
                    value={innovatorForm.image} 
                    onChange={(url) => setInnovatorForm({ ...innovatorForm, image: url })}
                    enableCrop
                  />
                  <Button onClick={handleAdd} className="w-full">{editingId ? 'Save Changes' : 'Add Innovation'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading innovators...</p>
        ) : (
          <div className="space-y-4">
            {pagedInnovators.map((innovator) => (
              <div key={innovator.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {innovator.image && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image src={innovator.image} alt={innovator.title || innovator.name} fill sizes="64px" className="object-cover" unoptimized={shouldUseUnoptimized(innovator.image)} />
                  </div>
                )}
                <div className="flex-1">
                  {innovator.ripd && <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{innovator.ripd}</span>}
                  <h4 className="font-semibold mt-1">{innovator.title || innovator.name}</h4>
                  {innovator.pi && <p className="text-sm text-gray-600">PI: {innovator.pi}</p>}
                  {innovator.coPi && <p className="text-sm text-gray-500">Co-PI: {innovator.coPi}</p>}
                  {innovator.category && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">{innovator.category}</span>}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(innovator)} className="mr-2"><Edit3 className="h-4 w-4" /></Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(innovator.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {innovators.length === 0 && <p className="text-center text-gray-500 py-8">No innovations yet. Add your first innovation!</p>}
            {innovators.length > 0 && pagedInnovators.length === 0 && <p className="text-center text-gray-500 py-8">No innovations match your search.</p>}

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
