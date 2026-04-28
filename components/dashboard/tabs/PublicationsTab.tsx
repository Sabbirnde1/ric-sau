'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { contentApi } from '@/lib/api-client';

export default function PublicationsTab() {
  const { toast } = useToast();
  
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [publicationForm, setPublicationForm] = useState({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    category: '',
    type: 'Journal Article',
    citations: 0,
    abstract: '',
    doi: '',
    keywords: ''
  });

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getMany('publications');
      setPublications(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch publications', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const filteredPublications = publications.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.journal?.toLowerCase().includes(search.toLowerCase()) ||
    (item.authors || []).join(' ').toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredPublications.length / ITEMS_PER_PAGE);
  const pagedPublications = filteredPublications.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAdd = async () => {
    if (!publicationForm.title) {
      toast({ title: 'Validation Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    
    try {
      const formData = {
        ...publicationForm,
        authors: publicationForm.authors.split(',').map((s: string) => s.trim()).filter(Boolean),
        keywords: publicationForm.keywords.split(',').map((s: string) => s.trim()).filter(Boolean),
      };

      await contentApi.create('publication', formData);
      toast({ title: 'Success', description: 'Publication added successfully' });
      setDialogOpen(false);
      setPublicationForm({
        title: '', authors: '', journal: '', year: new Date().getFullYear(),
        category: '', type: 'Journal Article', citations: 0, abstract: '', doi: '', keywords: ''
      });
      fetchPublications();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add publication', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    try {
      await contentApi.delete('publication', id);
      toast({ title: 'Deleted', description: 'Publication removed' });
      fetchPublications();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Research Publications</CardTitle>
            <CardDescription>Manage research papers and publications</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search publications..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Publication</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add New Publication</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Title</Label><Input value={publicationForm.title} onChange={(e) => setPublicationForm({ ...publicationForm, title: e.target.value })} placeholder="Paper title" /></div>
                  <div><Label>Authors (comma-separated)</Label><Input value={publicationForm.authors} onChange={(e) => setPublicationForm({ ...publicationForm, authors: e.target.value })} placeholder="Dr. John Doe, Prof. Jane Smith" /></div>
                  <div><Label>Journal / Venue</Label><Input value={publicationForm.journal} onChange={(e) => setPublicationForm({ ...publicationForm, journal: e.target.value })} placeholder="IEEE Transactions on..." /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label>Year</Label><Input type="number" value={publicationForm.year} onChange={(e) => setPublicationForm({ ...publicationForm, year: Number(e.target.value) })} /></div>
                    <div><Label>Category</Label><Input value={publicationForm.category} onChange={(e) => setPublicationForm({ ...publicationForm, category: e.target.value })} placeholder="AI & Healthcare" /></div>
                    <div><Label>Type</Label><Input value={publicationForm.type} onChange={(e) => setPublicationForm({ ...publicationForm, type: e.target.value })} placeholder="Journal Article" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Citations</Label><Input type="number" value={publicationForm.citations} onChange={(e) => setPublicationForm({ ...publicationForm, citations: Number(e.target.value) })} /></div>
                    <div><Label>DOI</Label><Input value={publicationForm.doi} onChange={(e) => setPublicationForm({ ...publicationForm, doi: e.target.value })} placeholder="10.1109/..." /></div>
                  </div>
                  <div><Label>Abstract</Label><Textarea value={publicationForm.abstract} onChange={(e) => setPublicationForm({ ...publicationForm, abstract: e.target.value })} rows={4} placeholder="Paper abstract..." /></div>
                  <div><Label>Keywords (comma-separated)</Label><Input value={publicationForm.keywords} onChange={(e) => setPublicationForm({ ...publicationForm, keywords: e.target.value })} placeholder="Deep Learning, Medical Imaging" /></div>
                  <Button onClick={handleAdd} className="w-full">Add Publication</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading publications...</p>
        ) : (
          <div className="space-y-4">
            {pagedPublications.map((pub: any) => (
              <div key={pub.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h4 className="font-semibold">{pub.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{(pub.authors || []).join(', ')}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{pub.category}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{pub.journal}</span>
                    <span className="text-xs text-gray-500">{pub.year} · {pub.citations} citations</span>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(pub.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {publications.length === 0 && <p className="text-center text-gray-500 py-8">No publications yet. Add your first publication!</p>}
            {publications.length > 0 && pagedPublications.length === 0 && <p className="text-center text-gray-500 py-8">No publications match your search.</p>}

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
