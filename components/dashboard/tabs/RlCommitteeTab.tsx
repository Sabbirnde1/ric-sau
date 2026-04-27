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

export default function RlCommitteeTab() {
  const { toast } = useToast();
  
  const [rlCommittee, setRlCommittee] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rlCommitteeForm, setRlCommitteeForm] = useState({ 
    name: '', role: '', department: '', email: '', bio: '', image: '', imagePlacement: 'top'
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchRlCommittee = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getMany('rl-committee');
      setRlCommittee(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch committee members', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRlCommittee();
  }, []);

  const filteredRlCommittee = rlCommittee.filter(item => 
    item.name?.toLowerCase().includes(search.toLowerCase()) || 
    item.role?.toLowerCase().includes(search.toLowerCase()) ||
    item.department?.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredRlCommittee.length / ITEMS_PER_PAGE);
  const pagedRlCommittee = filteredRlCommittee.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAdd = async () => {
    if (!rlCommitteeForm.name) {
      toast({ title: 'Validation Error', description: 'Name is required', variant: 'destructive' });
      return;
    }
    
    try {
      if (editingId) {
        await contentApi.update('rl-committee', editingId, rlCommitteeForm);
        toast({ title: 'Success', description: 'Committee member updated' });
      } else {
        await contentApi.create('rl-committee', rlCommitteeForm);
        toast({ title: 'Success', description: 'Committee member added' });
      }
      setDialogOpen(false);
      setEditingId(null);
      setRlCommitteeForm({ name: '', role: '', department: '', email: '', bio: '', image: '', imagePlacement: 'top' });
      fetchRlCommittee();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save committee member', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await contentApi.delete('rl-committee', id);
      toast({ title: 'Deleted', description: 'Member removed' });
      fetchRlCommittee();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setRlCommitteeForm({
      name: item.name || '',
      role: item.role || '',
      department: item.department || '',
      email: item.email || '',
      bio: item.bio || '',
      image: item.image || '',
      imagePlacement: item.imagePlacement || 'top'
    });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>RL Committee</CardTitle>
            <CardDescription>Manage Research & Learning Committee members</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search committee..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingId(null);
                setRlCommitteeForm({ name: '', role: '', department: '', email: '', bio: '', image: '', imagePlacement: 'top' });
              }
            }}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Member</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingId ? 'Edit Committee Member' : 'Add Committee Member'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Name</Label><Input value={rlCommitteeForm.name} onChange={(e) => setRlCommitteeForm({ ...rlCommitteeForm, name: e.target.value })} placeholder="Prof. Dr. Ahmed Hassan" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Role</Label><Input value={rlCommitteeForm.role} onChange={(e) => setRlCommitteeForm({ ...rlCommitteeForm, role: e.target.value })} placeholder="Committee Chairman" /></div>
                    <div>
                      <Label>Image Placement</Label>
                      <select
                        value={rlCommitteeForm.imagePlacement}
                        onChange={(e) => setRlCommitteeForm({ ...rlCommitteeForm, imagePlacement: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="top">Top</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Department</Label><Input value={rlCommitteeForm.department} onChange={(e) => setRlCommitteeForm({ ...rlCommitteeForm, department: e.target.value })} placeholder="Agricultural Research" /></div>
                    <div><Label>Email</Label><Input type="email" value={rlCommitteeForm.email} onChange={(e) => setRlCommitteeForm({ ...rlCommitteeForm, email: e.target.value })} /></div>
                  </div>
                  <div><Label>Bio</Label><Textarea value={rlCommitteeForm.bio} onChange={(e) => setRlCommitteeForm({ ...rlCommitteeForm, bio: e.target.value })} rows={3} /></div>
                  <ImageUpload 
                    label="Profile Photo" 
                    value={rlCommitteeForm.image} 
                    onChange={(url) => setRlCommitteeForm({ ...rlCommitteeForm, image: url })}
                    enableCrop
                    cropShape="circle"
                  />
                  <Button onClick={handleAdd} className="w-full">{editingId ? 'Save Changes' : 'Add Member'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading committee...</p>
        ) : (
          <div className="space-y-4">
            {pagedRlCommittee.map((member) => (
              <div key={member.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {member.image && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                    <Image src={member.image} alt={member.name} fill sizes="64px" className="object-cover" unoptimized={shouldUseUnoptimized(member.image)} />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{member.department} • {member.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(member)} className="mr-2"><Edit3 className="h-4 w-4" /></Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {rlCommittee.length === 0 && <p className="text-center text-gray-500 py-8">No committee members yet. Add your first member!</p>}
            {rlCommittee.length > 0 && pagedRlCommittee.length === 0 && <p className="text-center text-gray-500 py-8">No members match your search.</p>}

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
