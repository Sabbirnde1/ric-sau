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
import RichTextEditor from '@/components/ui/rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ui/image-upload';
import { contentApi } from '@/lib/api-client';
import { shouldUseUnoptimized } from '@/lib/utils';

export default function TeamTab() {
  const { toast } = useToast();
  
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({ 
    name: '', position: '', department: '', email: '', bio: '', image: '' 
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await contentApi.getMany('team');
      setTeam(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch team members', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const filteredTeam = team.filter(item => 
    item.name?.toLowerCase().includes(search.toLowerCase()) || 
    item.position?.toLowerCase().includes(search.toLowerCase()) ||
    item.department?.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredTeam.length / ITEMS_PER_PAGE);
  const pagedTeam = filteredTeam.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAdd = async () => {
    if (!teamForm.name) {
      toast({ title: 'Validation Error', description: 'Name is required', variant: 'destructive' });
      return;
    }
    
    try {
      if (editingId) {
        await contentApi.update('team', editingId, teamForm);
        toast({ title: 'Success', description: 'Team member updated' });
      } else {
        await contentApi.create('team', teamForm);
        toast({ title: 'Success', description: 'Team member added' });
      }
      setDialogOpen(false);
      setEditingId(null);
      setTeamForm({ name: '', position: '', department: '', email: '', bio: '', image: '' });
      fetchTeam();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save team member', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await contentApi.delete('team', id);
      toast({ title: 'Deleted', description: 'Member removed' });
      fetchTeam();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member.id);
    setTeamForm({
      name: member.name || '',
      position: member.position || '',
      department: member.department || '',
      email: member.email || '',
      bio: member.bio || '',
      image: member.image || ''
    });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage team member profiles</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search team..."
                className="pl-8"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingId(null);
                setTeamForm({ name: '', position: '', department: '', email: '', bio: '', image: '' });
              }
            }}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Add Member</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{editingId ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Name</Label><Input value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="Dr. John Doe" /></div>
                  <div><Label>Position</Label><Input value={teamForm.position} onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })} placeholder="Research Director" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Department</Label><Input value={teamForm.department} onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })} placeholder="Research Department" /></div>
                    <div><Label>Email</Label><Input type="email" value={teamForm.email} onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })} placeholder="email@example.com" /></div>
                  </div>
                  <RichTextEditor
                    label="Bio"
                    value={teamForm.bio}
                    onChange={(val) => setTeamForm({ ...teamForm, bio: val })}
                    placeholder="Professional bio and experience"
                  />
                  <ImageUpload 
                    label="Profile Photo" 
                    value={teamForm.image} 
                    onChange={(url) => setTeamForm({ ...teamForm, image: url })}
                    enableCrop
                    cropShape="circle"
                    cropShapeOptions={['circle', 'rect']}
                    optimizePreset="profile"
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
          <p className="text-center py-8 text-gray-500">Loading team...</p>
        ) : (
          <div className="space-y-4">
            {pagedTeam.map((member) => (
              <div key={member.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {member.image && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                    <Image src={member.image} alt={member.name} fill sizes="64px" className="object-cover" unoptimized={shouldUseUnoptimized(member.image)} />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.position}</p>
                  <p className="text-xs text-gray-500 mt-1">{member.department} • {member.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(member)} className="mr-2"><Edit3 className="h-4 w-4" /></Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {team.length === 0 && <p className="text-center text-gray-500 py-8">No team members yet. Add your first member!</p>}
            {team.length > 0 && pagedTeam.length === 0 && <p className="text-center text-gray-500 py-8">No members match your search.</p>}

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
