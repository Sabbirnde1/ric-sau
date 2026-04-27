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

const shouldUseUnoptimized = (src: string) =>
  src.startsWith('data:') || (src.startsWith('http') && !src.includes('images.pexels.com'));

export default function EventsTab() {
  const { toast } = useToast();
  
  // State
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Dialog & Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventForm, setEventForm] = useState({ 
    title: '', description: '', date: '', time: '', location: '', category: '', image: '' 
  });
  
  // Quick Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  // Fetch Data
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getMany('event');
      setEvents(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch events', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter and Paginate
  const filteredEvents = events.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.category?.toLowerCase().includes(search.toLowerCase()) ||
    item.location?.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const pagedEvents = filteredEvents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Handlers
  const handleAdd = async () => {
    if (!eventForm.title || !eventForm.date) {
      toast({ title: 'Validation Error', description: 'Title and Date are required', variant: 'destructive' });
      return;
    }
    
    try {
      await contentApi.create('event', eventForm);
      toast({ title: 'Success', description: 'Event added successfully' });
      setDialogOpen(false);
      setEventForm({ title: '', description: '', date: '', time: '', location: '', category: '', image: '' });
      fetchEvents();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add event', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await contentApi.delete('event', id);
      toast({ title: 'Deleted', description: 'Event removed' });
      fetchEvents();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ title: item.title, category: item.category, date: item.date, location: item.location });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await contentApi.update('event', editingId, editData);
      toast({ title: 'Success', description: 'Event updated' });
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Events</CardTitle>
            <CardDescription>Manage upcoming and past events</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Event</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Event Title</Label>
                    <Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Conference, Workshop, etc." />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} placeholder="10:00 AM - 5:00 PM" />
                    </div>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="City, Country" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} placeholder="Conference, Summit, Workshop" />
                  </div>
                  <ImageUpload 
                    label="Event Image" 
                    value={eventForm.image} 
                    onChange={(url) => setEventForm({ ...eventForm, image: url })}
                    enableCrop
                  />
                  <Button onClick={handleAdd} className="w-full">Add Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading events...</p>
        ) : (
          <div className="space-y-4">
            {pagedEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {event.image && (
                  <div className="relative w-20 h-20 rounded overflow-hidden shrink-0">
                    <Image src={event.image} alt={event.title} fill sizes="80px" className="object-cover" unoptimized={shouldUseUnoptimized(event.image)} />
                  </div>
                )}
                <div className="flex-1">
                  {editingId === event.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        placeholder="Event title"
                      />
                      <div className="grid grid-cols-3 gap-2">
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
                        <Input
                          value={editData.location || ''}
                          onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                          placeholder="Location"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description?.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{event.category}</span>
                        <span className="text-xs text-gray-500">{event.date} • {event.location}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingId === event.id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={saveEdit}>Save</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => startEdit(event)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {events.length === 0 && <p className="text-center text-gray-500 py-8">No events yet. Add your first event!</p>}
            {events.length > 0 && pagedEvents.length === 0 && <p className="text-center text-gray-500 py-8">No events match your search.</p>}

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
