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
import RichTextEditor from '@/components/ui/rich-text-editor';
import { contentApi } from '@/lib/api-client';

const shouldUseUnoptimized = (src: string) =>
  src.startsWith('data:') || (src.startsWith('http') && !src.includes('images.pexels.com'));

export default function NewsTab() {
  const { toast } = useToast();
  
  // State
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Dialog & Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({ 
    title: '', excerpt: '', content: '', category: '', image: '', readTime: '3 min read' 
  });
  
  // Quick Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  // Fetch Data
  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getMany('news');
      setNews(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch news', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Filter and Paginate
  const filteredNews = news.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.category?.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const pagedNews = filteredNews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Handlers
  const handleAdd = async () => {
    if (!newsForm.title) {
      toast({ title: 'Validation Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    
    try {
      const data = {
        ...newsForm,
        slug: newsForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        date: new Date().toISOString().split('T')[0]
      };
      
      await contentApi.create('news', data);
      toast({ title: 'Success', description: 'News article added successfully' });
      setDialogOpen(false);
      setNewsForm({ title: '', excerpt: '', content: '', category: '', image: '', readTime: '3 min read' });
      fetchNews();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add news', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await contentApi.delete('news', id);
      toast({ title: 'Deleted', description: 'News article removed' });
      fetchNews();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ title: item.title, category: item.category, date: item.date });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await contentApi.update('news', editingId, editData);
      toast({ title: 'Success', description: 'News article updated' });
      setEditingId(null);
      fetchNews();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>News & Articles</CardTitle>
            <CardDescription>Manage news articles and press releases</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search news..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add News</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add News Article</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="Article title" />
                  </div>
                  <div>
                    <Label>Excerpt (Summary)</Label>
                    <Textarea value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} rows={2} placeholder="Brief summary" />
                  </div>
                  <RichTextEditor
                    label="Full Content"
                    value={newsForm.content}
                    onChange={(val) => setNewsForm({ ...newsForm, content: val })}
                    rows={8}
                    placeholder="Full article content with formatting..."
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Input value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} placeholder="Awards, Research..." />
                    </div>
                    <div>
                      <Label>Read Time</Label>
                      <Input value={newsForm.readTime} onChange={(e) => setNewsForm({ ...newsForm, readTime: e.target.value })} placeholder="3 min read" />
                    </div>
                  </div>
                  <ImageUpload 
                    label="News Image" 
                    value={newsForm.image} 
                    onChange={(url) => setNewsForm({ ...newsForm, image: url })}
                    enableCrop
                  />
                  <Button onClick={handleAdd} className="w-full">Add News</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading news...</p>
        ) : (
          <div className="space-y-4">
            {pagedNews.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {item.image && (
                  <div className="relative w-20 h-20 rounded overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" unoptimized={shouldUseUnoptimized(item.image)} />
                  </div>
                )}
                <div className="flex-1">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        placeholder="News title"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={editData.category || ''}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          placeholder="Category"
                        />
                        <Input
                          value={editData.date || ''}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                          placeholder="YYYY-MM-DD"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item.excerpt?.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{item.category}</span>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingId === item.id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={saveEdit}>Save</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {news.length === 0 && <p className="text-center text-gray-500 py-8">No news articles yet. Add your first article!</p>}
            {news.length > 0 && pagedNews.length === 0 && <p className="text-center text-gray-500 py-8">No news items match your search.</p>}

            {/* Pagination */}
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
