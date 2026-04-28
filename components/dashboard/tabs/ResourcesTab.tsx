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

export default function ResourcesTab() {
  const { toast } = useToast();
  
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', image: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getMany('resources');
      setResources(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch resources', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = resources.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.description?.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const pagedResources = filteredResources.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAdd = async () => {
    if (!resourceForm.title) {
      toast({ title: 'Validation Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    
    try {
      if (editingId) {
        await contentApi.update('resource', editingId, resourceForm);
        toast({ title: 'Success', description: 'Resource updated' });
      } else {
        await contentApi.create('resource', resourceForm);
        toast({ title: 'Success', description: 'Resource added' });
      }
      setDialogOpen(false);
      setEditingId(null);
      setResourceForm({ title: '', description: '', image: '' });
      fetchResources();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save resource', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await contentApi.delete('resource', id);
      toast({ title: 'Deleted', description: 'Resource removed' });
      fetchResources();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setResourceForm({
      title: item.title || '',
      description: item.description || '',
      image: item.image || ''
    });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Resources & Facilities</CardTitle>
            <CardDescription>Manage equipment and facilities available</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingId(null);
                setResourceForm({ title: '', description: '', image: '' });
              }
            }}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Resource</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingId ? 'Edit Resource' : 'Add New Resource'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Resource Name</Label><Input value={resourceForm.title} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} placeholder="High Performance Computing Cluster" /></div>
                  <div><Label>Description</Label><Textarea value={resourceForm.description} onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} rows={4} placeholder="Details about the resource..." /></div>
                  <ImageUpload label="Resource Image" value={resourceForm.image} onChange={(url) => setResourceForm({ ...resourceForm, image: url })} enableCrop />
                  <Button onClick={handleAdd} className="w-full">{editingId ? 'Save Changes' : 'Add Resource'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading resources...</p>
        ) : (
          <div className="space-y-4">
            {pagedResources.map((resource: any) => (
              <div key={resource.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {resource.image && (
                  <div className="relative w-20 h-20 rounded overflow-hidden shrink-0">
                    <Image src={resource.image} alt={resource.title} fill sizes="80px" className="object-cover" unoptimized={shouldUseUnoptimized(resource.image)} />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{resource.description?.substring(0, 100)}...</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(resource)} className="mr-2"><Edit3 className="h-4 w-4" /></Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(resource.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {resources.length === 0 && <p className="text-center text-gray-500 py-8">No resources yet. Add your first resource!</p>}
            {resources.length > 0 && pagedResources.length === 0 && <p className="text-center text-gray-500 py-8">No resources match your search.</p>}

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
