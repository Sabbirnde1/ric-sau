'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Users, FileText, Briefcase, Calendar, Award, Mail, Home, Info, Settings, Image as ImageIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { ToastAction } from '@/components/ui/toast';
import ImageUpload from '@/components/ui/image-upload';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { useToast } from '@/hooks/use-toast';

export default function DashboardContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [listSearch, setListSearch] = useState('');
  const [quickEditItem, setQuickEditItem] = useState<{ type: 'project' | 'news' | 'event'; id: number } | null>(null);
  const [quickEditData, setQuickEditData] = useState<Record<string, any>>({});
  const pendingDeleteRef = useRef<Record<string, { timeoutId: ReturnType<typeof setTimeout>; item: any; type: string }>>({});
  
  // Data states
  const [homeData, setHomeData] = useState<any>({});
  const [aboutData, setAboutData] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [innovators, setInnovators] = useState<any[]>([]);
  const [rlCommittee, setRlCommittee] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any>({});
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [publications, setPublications] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  // Dialog states
  const [dialogStates, setDialogStates] = useState({
    home: false,
    about: false,
    project: false,
    news: false,
    event: false,
    team: false,
    innovator: false,
    rlCommittee: false,
    contact: false,
    settings: false,
    publication: false,
    lab: false,
    resource: false
  });

  // Form states with image upload support
  const [homeForm, setHomeForm] = useState({ 
    title: '', 
    subtitle: '', 
    description: '', 
    videoUrl: '',
    backgroundImage: ''
  });
  const [statsForm, setStatsForm] = useState<any[]>([]);
  const [featuresForm, setFeaturesForm] = useState<any[]>([]);
  const [ctaForm, setCtaForm] = useState({ title: '', highlight: '', description: '' });
  
  const [aboutForm, setAboutForm] = useState({ 
    mission: '', 
    vision: '', 
    description: '', 
    established: '',
    image: '',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    identity: '',
    fundingImage: '',
    applyEmail: '',
    ctaTitle: '',
    ctaSubtitle: '',
  });
  const [aboutFundingForm, setAboutFundingForm] = useState<any[]>([]);
  const [aboutWhoCanApplyForm, setAboutWhoCanApplyForm] = useState<string[]>([]);
  const [aboutWhatYouGetForm, setAboutWhatYouGetForm] = useState<string[]>([]);
  const [aboutFocusAreasForm, setAboutFocusAreasForm] = useState<string[]>([]);
  const [aboutHowToApplyForm, setAboutHowToApplyForm] = useState<string[]>([]);
  
  const [projectForm, setProjectForm] = useState({ 
    title: '', 
    description: '', 
    category: '', 
    status: 'Active', 
    lead: '', 
    startDate: '', 
    budget: 0, 
    image: '' 
  });
  
  const [newsForm, setNewsForm] = useState({ 
    title: '', 
    excerpt: '', 
    content: '', 
    category: '', 
    image: '', 
    readTime: '3 min read' 
  });
  
  const [eventForm, setEventForm] = useState({ 
    title: '', 
    description: '', 
    date: '', 
    time: '', 
    location: '', 
    category: '', 
    image: '' 
  });
  
  const [teamForm, setTeamForm] = useState({ 
    name: '', 
    position: '', 
    department: '', 
    email: '', 
    bio: '', 
    image: '' 
  });
  
  const [innovatorForm, setInnovatorForm] = useState({ 
    name: '', 
    title: '', 
    bio: '', 
    specialization: '', 
    image: '',
    achievements: '',
    ripd: '',
    pi: '',
    coPi: '',
    category: ''
  });
  
  const [rlCommitteeForm, setRlCommitteeForm] = useState({ 
    name: '', 
    role: '', 
    department: '', 
    email: '', 
    bio: '', 
    image: '',
    imagePlacement: 'top'
  });
  const [editingRlCommitteeId, setEditingRlCommitteeId] = useState<number | null>(null);
  
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

  const [labForm, setLabForm] = useState({
    name: '',
    director: '',
    location: '',
    established: new Date().getFullYear(),
    members: 0,
    focus: '',
    description: '',
    equipment: '',
    projects: 0,
    publications: 0,
    image: ''
  });

  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    image: ''
  });
  
  const [contactForm, setContactForm] = useState({ 
    address: '', 
    phone: '', 
    email: '', 
    officeHours: '' 
  });

  const [settingsForm, setSettingsForm] = useState({
    siteName: '',
    tagline: '',
    description: '',
    logo: '',
    favicon: '',
    footerText: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    instagram: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem('dashboard-drafts-v1');
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (draft.homeForm) setHomeForm(draft.homeForm);
      if (draft.statsForm) setStatsForm(draft.statsForm);
      if (draft.featuresForm) setFeaturesForm(draft.featuresForm);
      if (draft.ctaForm) setCtaForm(draft.ctaForm);
      if (draft.aboutForm) setAboutForm(draft.aboutForm);
      if (draft.aboutFundingForm) setAboutFundingForm(draft.aboutFundingForm);
      if (draft.aboutWhoCanApplyForm) setAboutWhoCanApplyForm(draft.aboutWhoCanApplyForm);
      if (draft.aboutWhatYouGetForm) setAboutWhatYouGetForm(draft.aboutWhatYouGetForm);
      if (draft.aboutFocusAreasForm) setAboutFocusAreasForm(draft.aboutFocusAreasForm);
      if (draft.aboutHowToApplyForm) setAboutHowToApplyForm(draft.aboutHowToApplyForm);
      if (draft.newsForm) setNewsForm(draft.newsForm);
    } catch (error) {
      console.error('Failed to load dashboard drafts:', error);
    }
  }, []);

  useEffect(() => {
    const draft = {
      homeForm,
      statsForm,
      featuresForm,
      ctaForm,
      aboutForm,
      aboutFundingForm,
      aboutWhoCanApplyForm,
      aboutWhatYouGetForm,
      aboutFocusAreasForm,
      aboutHowToApplyForm,
      newsForm,
    };
    localStorage.setItem('dashboard-drafts-v1', JSON.stringify(draft));
  }, [
    homeForm,
    statsForm,
    featuresForm,
    ctaForm,
    aboutForm,
    aboutFundingForm,
    aboutWhoCanApplyForm,
    aboutWhatYouGetForm,
    aboutFocusAreasForm,
    aboutHowToApplyForm,
    newsForm,
  ]);

  useEffect(() => {
    return () => {
      Object.values(pendingDeleteRef.current).forEach((entry) => {
        clearTimeout(entry.timeoutId);
      });
      pendingDeleteRef.current = {};
    };
  }, []);

  const clearDashboardDrafts = (keys: Array<'home' | 'about' | 'news'>) => {
    const raw = localStorage.getItem('dashboard-drafts-v1');
    if (!raw) return;

    try {
      const draft = JSON.parse(raw);
      if (keys.includes('home')) {
        delete draft.homeForm;
        delete draft.statsForm;
        delete draft.featuresForm;
        delete draft.ctaForm;
      }
      if (keys.includes('about')) {
        delete draft.aboutForm;
        delete draft.aboutFundingForm;
        delete draft.aboutWhoCanApplyForm;
        delete draft.aboutWhatYouGetForm;
        delete draft.aboutFocusAreasForm;
        delete draft.aboutHowToApplyForm;
      }
      if (keys.includes('news')) {
        delete draft.newsForm;
      }
      localStorage.setItem('dashboard-drafts-v1', JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to clear dashboard drafts:', error);
    }
  };

  const getItemsByType = (type: string) => {
    switch (type) {
      case 'project': return projects;
      case 'news': return news;
      case 'event': return events;
      case 'team': return team;
      case 'innovator': return innovators;
      case 'rlCommittee': return rlCommittee;
      case 'publication': return publications;
      case 'lab': return labs;
      case 'resource': return resources;
      default: return [];
    }
  };

  const setItemsByType = (type: string, updater: (prev: any[]) => any[]) => {
    switch (type) {
      case 'project':
        setProjects((prev) => updater(prev));
        break;
      case 'news':
        setNews((prev) => updater(prev));
        break;
      case 'event':
        setEvents((prev) => updater(prev));
        break;
      case 'team':
        setTeam((prev) => updater(prev));
        break;
      case 'innovator':
        setInnovators((prev) => updater(prev));
        break;
      case 'rlCommittee':
        setRlCommittee((prev) => updater(prev));
        break;
      case 'publication':
        setPublications((prev) => updater(prev));
        break;
      case 'lab':
        setLabs((prev) => updater(prev));
        break;
      case 'resource':
        setResources((prev) => updater(prev));
        break;
      default:
        break;
    }
  };

  const fetchAllData = async () => {
    try {
      const [homeRes, aboutRes, projectsRes, newsRes, eventsRes, teamRes, innovatorsRes, rlCommitteeRes, contactRes, settingsRes, pubRes, labsRes, resourcesRes] = await Promise.all([
        fetch('/api/content?type=home'),
        fetch('/api/content?type=about'),
        fetch('/api/content?type=projects'),
        fetch('/api/content?type=news'),
        fetch('/api/content?type=events'),
        fetch('/api/content?type=team'),
        fetch('/api/content?type=innovators'),
        fetch('/api/content?type=rlCommittee'),
        fetch('/api/content?type=contact'),
        fetch('/api/settings'),
        fetch('/api/content?type=publications'),
        fetch('/api/content?type=labs'),
        fetch('/api/content?type=resources'),
      ]);

      const home = await homeRes.json();
      const about = await aboutRes.json();
      const projectsData = await projectsRes.json();
      const newsData = await newsRes.json();
      const eventsData = await eventsRes.json();
      const teamData = await teamRes.json();
      const innovatorsData = await innovatorsRes.json();
      const rlCommitteeData = await rlCommitteeRes.json();
      const contact = await contactRes.json();
      const settings = await settingsRes.json();
      const pubData = await pubRes.json();
      const labsData = await labsRes.json();
      const resourcesData = await resourcesRes.json();

      setHomeData(home.data || {});
      setAboutData(about.data || {});
      setProjects(projectsData.data || []);
      setNews(newsData.data || []);
      setEvents(eventsData.data || []);
      setTeam(teamData.data || []);
      setInnovators(innovatorsData.data || []);
      setRlCommittee(rlCommitteeData.data || []);
      setContactData(contact.data || {});
      setSiteSettings(settings.data || {});
      setPublications(pubData.data || []);
      setLabs(labsData.data || []);
      setResources(resourcesData.data || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/login');
  };

  const handleUpdateHome = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'home',
          data: {
            hero: homeForm,
            stats: statsForm,
            features: featuresForm,
            cta: ctaForm,
          }
        })
      });
      if (response.ok) {
        fetchAllData();
        setDialogStates({ ...dialogStates, home: false });
        clearDashboardDrafts(['home']);
        toast({ title: 'Home content updated', description: 'All Home section changes were saved.' });
      }
    } catch (error) {
      console.error('Error updating home:', error);
      toast({ title: 'Update failed', description: 'Could not update Home content.', variant: 'destructive' });
    }
  };

  const handleUpdateAbout = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'about',
          data: {
            ...aboutForm,
            funding: aboutFundingForm,
            whoCanApply: aboutWhoCanApplyForm,
            whatYouGet: aboutWhatYouGetForm,
            focusAreas: aboutFocusAreasForm,
            howToApply: aboutHowToApplyForm,
          }
        })
      });
      if (response.ok) {
        fetchAllData();
        setDialogStates({ ...dialogStates, about: false });
        clearDashboardDrafts(['about']);
        toast({ title: 'About content updated', description: 'All About section changes were saved.' });
      }
    } catch (error) {
      console.error('Error updating about:', error);
      toast({ title: 'Update failed', description: 'Could not update About content.', variant: 'destructive' });
    }
  };

  const handleUpdateContact = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', data: contactForm })
      });
      if (response.ok) {
        fetchAllData();
        setDialogStates({ ...dialogStates, contact: false });
        toast({ title: 'Contact updated', description: 'Contact information was saved.' });
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({ title: 'Update failed', description: 'Could not update contact information.', variant: 'destructive' });
    }
  };

  const handleUpdateSettings = async () => {
    try {
      const generalData = {
        siteName: settingsForm.siteName,
        tagline: settingsForm.tagline,
        description: settingsForm.description,
        logo: settingsForm.logo,
        favicon: settingsForm.favicon,
        footerText: settingsForm.footerText
      };

      const socialData = {
        facebook: settingsForm.facebook,
        twitter: settingsForm.twitter,
        linkedin: settingsForm.linkedin,
        youtube: settingsForm.youtube,
        instagram: settingsForm.instagram
      };

      await Promise.all([
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: 'general', data: generalData })
        }),
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: 'social', data: socialData })
        })
      ]);

      fetchAllData();
      setDialogStates({ ...dialogStates, settings: false });
      toast({ title: 'Settings updated', description: 'Site settings were saved successfully.' });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({ title: 'Update failed', description: 'Could not update site settings.', variant: 'destructive' });
    }
  };

  const handleAdd = async (type: string, form: any, resetForm: any) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: form })
      });
      if (response.ok) {
        fetchAllData();
        resetForm();
        setDialogStates({ ...dialogStates, [type]: false });
        if (type === 'news') {
          clearDashboardDrafts(['news']);
        }
        toast({ title: 'Item added', description: 'New content item created successfully.' });
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast({ title: 'Create failed', description: `Could not add ${type}.`, variant: 'destructive' });
    }
  };

  const handleSaveRlCommittee = async () => {
    try {
      const isEditing = editingRlCommitteeId !== null;
      const response = await fetch('/api/content', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isEditing
            ? { type: 'rlCommittee', id: editingRlCommitteeId, data: rlCommitteeForm }
            : { type: 'rlCommittee', data: rlCommitteeForm }
        )
      });

      if (response.ok) {
        fetchAllData();
        resetRlCommitteeForm();
        setEditingRlCommitteeId(null);
        setDialogStates({ ...dialogStates, rlCommittee: false });
        toast({
          title: isEditing ? 'Member updated' : 'Member added',
          description: isEditing
            ? 'Committee member information was updated.'
            : 'Committee member was created successfully.',
        });
      }
    } catch (error) {
      console.error('Error saving rlCommittee:', error);
      toast({ title: 'Save failed', description: 'Could not save committee member.', variant: 'destructive' });
    }
  };

  const confirmDeleteNow = async (type: string, id: number, key: string) => {
    try {
      const response = await fetch(`/api/content?type=${type}&id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const pending = pendingDeleteRef.current[key];
        if (pending) {
          setItemsByType(type, (prev) => [pending.item, ...prev]);
          delete pendingDeleteRef.current[key];
        }
        toast({ title: 'Delete failed', description: `Could not delete ${type}.`, variant: 'destructive' });
        return;
      }

      delete pendingDeleteRef.current[key];
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      const pending = pendingDeleteRef.current[key];
      if (pending) {
        setItemsByType(type, (prev) => [pending.item, ...prev]);
        delete pendingDeleteRef.current[key];
      }
      toast({ title: 'Delete failed', description: `Could not delete ${type}.`, variant: 'destructive' });
    }
  };

  const undoDelete = (key: string) => {
    const pending = pendingDeleteRef.current[key];
    if (!pending) return;

    clearTimeout(pending.timeoutId);
    setItemsByType(pending.type, (prev) => [pending.item, ...prev]);
    delete pendingDeleteRef.current[key];
    toast({ title: 'Delete undone', description: 'Item restoration complete.' });
  };

  const handleDelete = async (type: string, id: number) => {
    const item = getItemsByType(type).find((entry: any) => entry.id === id);
    if (!item) return;

    const key = `${type}-${id}`;
    const existing = pendingDeleteRef.current[key];
    if (existing) {
      clearTimeout(existing.timeoutId);
    }

    setItemsByType(type, (prev) => prev.filter((entry: any) => entry.id !== id));

    const timeoutId = setTimeout(() => {
      void confirmDeleteNow(type, id, key);
    }, 5000);

    pendingDeleteRef.current[key] = { timeoutId, item, type };

    toast({
      title: 'Item moved to pending delete',
      description: 'Item will be deleted in 5 seconds.',
      action: (
        <ToastAction altText="Undo delete" onClick={() => undoDelete(key)}>
          Undo
        </ToastAction>
      ),
    });
  };

  const startQuickEdit = (type: 'project' | 'news' | 'event', item: any) => {
    setQuickEditItem({ type, id: item.id });
    if (type === 'project') {
      setQuickEditData({
        title: item.title || '',
        category: item.category || '',
        lead: item.lead || '',
      });
      return;
    }

    if (type === 'news') {
      setQuickEditData({
        title: item.title || '',
        category: item.category || '',
        date: item.date || '',
      });
      return;
    }

    setQuickEditData({
      title: item.title || '',
      category: item.category || '',
      date: item.date || '',
      location: item.location || '',
    });
  };

  const cancelQuickEdit = () => {
    setQuickEditItem(null);
    setQuickEditData({});
  };

  const saveQuickEdit = async () => {
    if (!quickEditItem) return;

    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: quickEditItem.type,
          id: quickEditItem.id,
          data: quickEditData,
        }),
      });

      if (response.ok) {
        toast({ title: 'Quick edit saved', description: 'Item updated successfully.' });
        cancelQuickEdit();
        fetchAllData();
      } else {
        toast({ title: 'Quick edit failed', description: 'Could not save inline changes.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error saving quick edit:', error);
      toast({ title: 'Quick edit failed', description: 'Could not save inline changes.', variant: 'destructive' });
    }
  };

  const resetProjectForm = () => setProjectForm({ title: '', description: '', category: '', status: 'Active', lead: '', startDate: '', budget: 0, image: '' });
  const resetNewsForm = () => setNewsForm({ title: '', excerpt: '', content: '', category: '', image: '', readTime: '3 min read' });
  const resetEventForm = () => setEventForm({ title: '', description: '', date: '', time: '', location: '', category: '', image: '' });
  const resetTeamForm = () => setTeamForm({ name: '', position: '', department: '', email: '', bio: '', image: '' });
  const resetInnovatorForm = () => setInnovatorForm({ name: '', title: '', bio: '', specialization: '', image: '', achievements: '', ripd: '', pi: '', coPi: '', category: '' });
  const resetRlCommitteeForm = () => setRlCommitteeForm({ name: '', role: '', department: '', email: '', bio: '', image: '', imagePlacement: 'top' });
  const resetPublicationForm = () => setPublicationForm({ title: '', authors: '', journal: '', year: new Date().getFullYear(), category: '', type: 'Journal Article', citations: 0, abstract: '', doi: '', keywords: '' });
  const resetLabForm = () => setLabForm({ name: '', director: '', location: '', established: new Date().getFullYear(), members: 0, focus: '', description: '', equipment: '', projects: 0, publications: 0, image: '' });
  const resetResourceForm = () => setResourceForm({ title: '', description: '', image: '' });

  const searchableTabs = new Set([
    'projects',
    'publications',
    'labs',
    'resources',
    'news',
    'events',
    'team',
    'innovators',
    'rl-committee',
  ]);

  const matchesSearch = (value: unknown) => {
    if (!listSearch.trim()) return true;
    return String(value ?? '').toLowerCase().includes(listSearch.toLowerCase().trim());
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((item) =>
      matchesSearch(item.title) ||
      matchesSearch(item.description) ||
      matchesSearch(item.category) ||
      matchesSearch(item.lead)
    );
  }, [projects, listSearch]);

  const filteredPublications = useMemo(() => {
    return publications.filter((item) =>
      matchesSearch(item.title) ||
      matchesSearch((item.authors || []).join(' ')) ||
      matchesSearch(item.journal) ||
      matchesSearch(item.category)
    );
  }, [publications, listSearch]);

  const filteredLabs = useMemo(() => {
    return labs.filter((item) =>
      matchesSearch(item.name) ||
      matchesSearch(item.description) ||
      matchesSearch(item.director) ||
      matchesSearch(item.location)
    );
  }, [labs, listSearch]);

  const filteredResources = useMemo(() => {
    return resources.filter((item) => matchesSearch(item.title) || matchesSearch(item.description));
  }, [resources, listSearch]);

  const filteredNews = useMemo(() => {
    return news.filter((item) =>
      matchesSearch(item.title) ||
      matchesSearch(item.excerpt) ||
      matchesSearch(item.category)
    );
  }, [news, listSearch]);

  const filteredEvents = useMemo(() => {
    return events.filter((item) =>
      matchesSearch(item.title) ||
      matchesSearch(item.description) ||
      matchesSearch(item.category) ||
      matchesSearch(item.location)
    );
  }, [events, listSearch]);

  const filteredTeam = useMemo(() => {
    return team.filter((item) =>
      matchesSearch(item.name) ||
      matchesSearch(item.position) ||
      matchesSearch(item.department) ||
      matchesSearch(item.email)
    );
  }, [team, listSearch]);

  const filteredInnovators = useMemo(() => {
    return innovators.filter((item) =>
      matchesSearch(item.name) ||
      matchesSearch(item.title) ||
      matchesSearch(item.category) ||
      matchesSearch(item.ripd) ||
      matchesSearch(item.pi) ||
      matchesSearch(item.coPi)
    );
  }, [innovators, listSearch]);

  const filteredRlCommittee = useMemo(() => {
    return rlCommittee.filter((item) =>
      matchesSearch(item.name) ||
      matchesSearch(item.role) ||
      matchesSearch(item.department) ||
      matchesSearch(item.email)
    );
  }, [rlCommittee, listSearch]);

  const activeTabCount = useMemo(() => {
    switch (activeTab) {
      case 'projects': return { total: projects.length, filtered: filteredProjects.length };
      case 'publications': return { total: publications.length, filtered: filteredPublications.length };
      case 'labs': return { total: labs.length, filtered: filteredLabs.length };
      case 'resources': return { total: resources.length, filtered: filteredResources.length };
      case 'news': return { total: news.length, filtered: filteredNews.length };
      case 'events': return { total: events.length, filtered: filteredEvents.length };
      case 'team': return { total: team.length, filtered: filteredTeam.length };
      case 'innovators': return { total: innovators.length, filtered: filteredInnovators.length };
      case 'rl-committee': return { total: rlCommittee.length, filtered: filteredRlCommittee.length };
      default: return { total: 0, filtered: 0 };
    }
  }, [
    activeTab,
    projects.length,
    publications.length,
    labs.length,
    resources.length,
    news.length,
    events.length,
    team.length,
    innovators.length,
    rlCommittee.length,
    filteredProjects.length,
    filteredPublications.length,
    filteredLabs.length,
    filteredResources.length,
    filteredNews.length,
    filteredEvents.length,
    filteredTeam.length,
    filteredInnovators.length,
    filteredRlCommittee.length,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage all website content from one place</p>
            </div>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Publications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publications.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Labs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{labs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">News</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{news.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Innovators</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{innovators.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="publications">Publications</TabsTrigger>
                <TabsTrigger value="labs">Labs</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="innovators">Innovators</TabsTrigger>
                <TabsTrigger value="rl-committee">RLC committee</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>

            {searchableTabs.has(activeTab) && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Input
                  placeholder="Search current tab..."
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  className="sm:max-w-md"
                />
                <div className="text-sm text-gray-600">
                  Showing {activeTabCount.filtered} of {activeTabCount.total}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setListSearch('');
                    fetchAllData();
                  }}
                  className="sm:ml-auto"
                >
                  Refresh
                </Button>
              </div>
            )}

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                    <CardDescription>Overview of all website content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Total Research Projects</span>
                        <span className="text-2xl font-bold text-blue-600">{projects.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">News Articles Published</span>
                        <span className="text-2xl font-bold text-green-600">{news.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">Upcoming Events</span>
                        <span className="text-2xl font-bold text-purple-600">{events.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium">Team Members</span>
                        <span className="text-2xl font-bold text-orange-600">{team.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                        <span className="font-medium">Innovators Recognized</span>
                        <span className="text-2xl font-bold text-pink-600">{innovators.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                        <span className="font-medium">RLC committee members</span>
                        <span className="text-2xl font-bold text-indigo-600">{rlCommittee.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates across all sections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {news.slice(0, 3).map((item) => (
                        <div key={item.id} className="p-3 border rounded-lg">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Home Tab */}
            <TabsContent value="home">
              <div className="space-y-6">
                {/* Hero Section Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Hero Section</CardTitle>
                        <CardDescription>Title, subtitle, video & background shown at the top of the home page</CardDescription>
                      </div>
                      <Dialog open={dialogStates.home} onOpenChange={(open) => setDialogStates({ ...dialogStates, home: open })}>
                        <DialogTrigger asChild>
                          <Button onClick={() => {
                            setHomeForm({ 
                              title: homeData.hero?.title || '', 
                              subtitle: homeData.hero?.subtitle || '', 
                              description: homeData.hero?.description || '', 
                              videoUrl: homeData.hero?.videoUrl || '',
                              backgroundImage: homeData.hero?.backgroundImage || ''
                            });
                            setStatsForm(homeData.stats?.length ? homeData.stats : [
                              { label: 'Research Projects', value: '50+' },
                              { label: 'Publications', value: '200+' },
                              { label: 'Team Members', value: '30+' },
                              { label: 'Awards', value: '15+' },
                            ]);
                            setFeaturesForm(homeData.features?.length ? homeData.features : [
                              { icon: 'Brain', title: 'Artificial Intelligence', description: 'Advanced AI research including machine learning, deep learning, and neural networks.', color: 'bg-blue-500' },
                              { icon: 'Code', title: 'Software Engineering', description: 'Cutting-edge software development methodologies and best practices.', color: 'bg-green-500' },
                              { icon: 'Database', title: 'Data Science', description: 'Big data analytics, data mining, and statistical modeling.', color: 'bg-purple-500' },
                              { icon: 'Shield', title: 'Cybersecurity', description: 'Advanced security research and threat detection mechanisms.', color: 'bg-red-500' },
                              { icon: 'Zap', title: 'IoT & Embedded Systems', description: 'Internet of Things solutions and smart device integration.', color: 'bg-yellow-500' },
                              { icon: 'Users', title: 'Human-Computer Interaction', description: 'User experience research and accessibility solutions.', color: 'bg-indigo-500' },
                            ]);
                            setCtaForm({
                              title: homeData.cta?.title || 'Ready to Collaborate on',
                              highlight: homeData.cta?.highlight || 'Groundbreaking Research?',
                              description: homeData.cta?.description || 'Join us in pushing the boundaries of technology and innovation.',
                            });
                          }}>
                            <Edit3 className="h-4 w-4 mr-2" />Edit All Sections
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>Edit Home Page Content</DialogTitle></DialogHeader>
                          <div className="space-y-6">
                            {/* Hero fields */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg border-b pb-2">Hero Section</h3>
                              <div><Label>Title</Label><Input value={homeForm.title} onChange={(e) => setHomeForm({ ...homeForm, title: e.target.value })} /></div>
                              <div><Label>Subtitle</Label><Textarea value={homeForm.subtitle} onChange={(e) => setHomeForm({ ...homeForm, subtitle: e.target.value })} rows={2} /></div>
                              <div><Label>Description</Label><Textarea value={homeForm.description} onChange={(e) => setHomeForm({ ...homeForm, description: e.target.value })} rows={3} /></div>
                              <div><Label>Video URL (YouTube)</Label><Input value={homeForm.videoUrl} onChange={(e) => setHomeForm({ ...homeForm, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></div>
                              <ImageUpload label="Background Image" value={homeForm.backgroundImage} onChange={(url) => setHomeForm({ ...homeForm, backgroundImage: url })} enableCrop />
                            </div>

                            {/* Stats */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-semibold text-lg">Stats Cards</h3>
                                <Button variant="outline" size="sm" onClick={() => setStatsForm([...statsForm, { label: '', value: '' }])}>
                                  <Plus className="h-3 w-3 mr-1" />Add Stat
                                </Button>
                              </div>
                              {statsForm.map((stat, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                  <div className="flex-1"><Label>Label</Label><Input value={stat.label} onChange={(e) => { const arr = [...statsForm]; arr[i] = { ...arr[i], label: e.target.value }; setStatsForm(arr); }} placeholder="e.g. Research Projects" /></div>
                                  <div className="w-28"><Label>Value</Label><Input value={stat.value} onChange={(e) => { const arr = [...statsForm]; arr[i] = { ...arr[i], value: e.target.value }; setStatsForm(arr); }} placeholder="e.g. 50+" /></div>
                                  <Button variant="ghost" size="sm" className="mt-6 text-red-500" onClick={() => setStatsForm(statsForm.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              ))}
                            </div>

                            {/* Features */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-semibold text-lg">Research Focus Areas</h3>
                                <Button variant="outline" size="sm" onClick={() => setFeaturesForm([...featuresForm, { icon: 'Brain', title: '', description: '', color: 'bg-blue-500' }])}>
                                  <Plus className="h-3 w-3 mr-1" />Add Feature
                                </Button>
                              </div>
                              {featuresForm.map((feat, i) => (
                                <div key={i} className="p-3 border rounded-lg space-y-3">
                                  <div className="flex gap-3">
                                    <div className="flex-1"><Label>Title</Label><Input value={feat.title} onChange={(e) => { const arr = [...featuresForm]; arr[i] = { ...arr[i], title: e.target.value }; setFeaturesForm(arr); }} /></div>
                                    <div className="w-32">
                                      <Label>Icon</Label>
                                      <select className="w-full h-10 px-3 border rounded-md text-sm" value={feat.icon} onChange={(e) => { const arr = [...featuresForm]; arr[i] = { ...arr[i], icon: e.target.value }; setFeaturesForm(arr); }}>
                                        <option value="Brain">Brain</option>
                                        <option value="Code">Code</option>
                                        <option value="Database">Database</option>
                                        <option value="Shield">Shield</option>
                                        <option value="Zap">Zap</option>
                                        <option value="Users">Users</option>
                                      </select>
                                    </div>
                                    <div className="w-36">
                                      <Label>Color</Label>
                                      <select className="w-full h-10 px-3 border rounded-md text-sm" value={feat.color} onChange={(e) => { const arr = [...featuresForm]; arr[i] = { ...arr[i], color: e.target.value }; setFeaturesForm(arr); }}>
                                        <option value="bg-blue-500">Blue</option>
                                        <option value="bg-green-500">Green</option>
                                        <option value="bg-purple-500">Purple</option>
                                        <option value="bg-red-500">Red</option>
                                        <option value="bg-yellow-500">Yellow</option>
                                        <option value="bg-indigo-500">Indigo</option>
                                      </select>
                                    </div>
                                    <Button variant="ghost" size="sm" className="mt-6 text-red-500" onClick={() => setFeaturesForm(featuresForm.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                                  </div>
                                  <div><Label>Description</Label><Textarea value={feat.description} onChange={(e) => { const arr = [...featuresForm]; arr[i] = { ...arr[i], description: e.target.value }; setFeaturesForm(arr); }} rows={2} /></div>
                                </div>
                              ))}
                            </div>

                            {/* CTA */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg border-b pb-2">Call to Action Section</h3>
                              <div><Label>Title</Label><Input value={ctaForm.title} onChange={(e) => setCtaForm({ ...ctaForm, title: e.target.value })} placeholder="Ready to Collaborate on" /></div>
                              <div><Label>Highlight Text</Label><Input value={ctaForm.highlight} onChange={(e) => setCtaForm({ ...ctaForm, highlight: e.target.value })} placeholder="Groundbreaking Research?" /></div>
                              <div><Label>Description</Label><Textarea value={ctaForm.description} onChange={(e) => setCtaForm({ ...ctaForm, description: e.target.value })} rows={3} /></div>
                            </div>

                            <Button onClick={handleUpdateHome} className="w-full" size="lg">Save All Home Page Content</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-3">Hero Section</h3>
                        <p><strong>Title:</strong> {homeData.hero?.title || <span className="text-gray-400 italic">Not set</span>}</p>
                        <p><strong>Subtitle:</strong> {homeData.hero?.subtitle || <span className="text-gray-400 italic">Not set</span>}</p>
                        <p><strong>Description:</strong> {homeData.hero?.description || <span className="text-gray-400 italic">Not set</span>}</p>
                        {homeData.hero?.videoUrl && <p><strong>Video URL:</strong> {homeData.hero.videoUrl}</p>}
                        {homeData.hero?.backgroundImage && (
                          <div className="mt-2">
                            <strong>Background Image:</strong>
                            <img src={homeData.hero.backgroundImage} alt="Hero" className="mt-2 w-full h-32 object-cover rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Preview Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Stats Cards</CardTitle>
                    <CardDescription>Statistics displayed on the hero section and stats section</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(homeData.stats && homeData.stats.length > 0 ? homeData.stats : []).map((stat: any, i: number) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg text-center">
                          <p className="text-xl font-bold text-blue-600">{stat.value}</p>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                      ))}
                      {(!homeData.stats || homeData.stats.length === 0) && (
                        <p className="text-gray-400 italic col-span-4">No stats configured. Click &quot;Edit All Sections&quot; to add stats.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Features Preview Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Research Focus Areas</CardTitle>
                    <CardDescription>Feature cards displayed below the hero section</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(homeData.features && homeData.features.length > 0 ? homeData.features : []).map((feat: any, i: number) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 ${feat.color || 'bg-blue-500'} rounded flex items-center justify-center text-white text-xs`}>{feat.icon}</div>
                            <p className="font-semibold">{feat.title}</p>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{feat.description}</p>
                        </div>
                      ))}
                      {(!homeData.features || homeData.features.length === 0) && (
                        <p className="text-gray-400 italic col-span-3">No features configured. Click &quot;Edit All Sections&quot; to add features.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Preview Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Call to Action</CardTitle>
                    <CardDescription>Bottom section with collaboration message</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <p className="font-semibold text-lg">{homeData.cta?.title || <span className="text-gray-400 italic">Not set</span>}</p>
                      <p className="text-purple-600 font-bold">{homeData.cta?.highlight || <span className="text-gray-400 italic">Not set</span>}</p>
                      <p className="text-gray-600 mt-2">{homeData.cta?.description || <span className="text-gray-400 italic">Not set</span>}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about">
              <div className="space-y-6">
                {/* About Hero & Identity Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>About Page Content</CardTitle>
                        <CardDescription>Manage all about page sections</CardDescription>
                      </div>
                      <Dialog open={dialogStates.about} onOpenChange={(open) => setDialogStates({ ...dialogStates, about: open })}>
                        <DialogTrigger asChild>
                          <Button onClick={() => {
                            setAboutForm({
                              mission: aboutData.mission || '',
                              vision: aboutData.vision || '',
                              description: aboutData.description || '',
                              established: aboutData.established || '',
                              image: aboutData.image || '',
                              heroTitle: aboutData.heroTitle || 'Research & Innovation Center (RIC - SAU)',
                              heroSubtitle: aboutData.heroSubtitle || 'Fostering innovation, entrepreneurship, and agricultural technology for a sustainable future.',
                              heroImage: aboutData.heroImage || '',
                              identity: aboutData.identity || '',
                              fundingImage: aboutData.fundingImage || '',
                              applyEmail: aboutData.applyEmail || 'info.sauric@gmail.com',
                              ctaTitle: aboutData.ctaTitle || 'Innovate. Collaborate. Transform Agriculture.',
                              ctaSubtitle: aboutData.ctaSubtitle || 'Join RIC–SAU to redefine agricultural innovation for a digital Bangladesh.',
                            });
                            setAboutFundingForm(aboutData.funding?.length ? aboutData.funding : [
                              { label: 'Financier', value: 'The World Bank' },
                              { label: 'Implementing Agency', value: 'Bangladesh Computer Council (BCC)' },
                              { label: 'Project', value: 'EDGE - Enhancing Digital Government and Economy' },
                              { label: 'Outcome', value: 'Research & Innovation Center (RIC - SAU)' },
                            ]);
                            setAboutWhoCanApplyForm(aboutData.whoCanApply?.length ? aboutData.whoCanApply : [
                              'SAU Students (UG/PG), Faculty & Researchers',
                              'Independent Innovators & Alumni',
                              'Early-stage Startups & Industry Partners',
                            ]);
                            setAboutWhatYouGetForm(aboutData.whatYouGet?.length ? aboutData.whatYouGet : [
                              'Modern laboratories & field testbeds',
                              'One-to-one mentoring & investor connect',
                              'End-to-end IP & commercialization support',
                              'Training, technology transfer & pilot deployment',
                            ]);
                            setAboutFocusAreasForm(aboutData.focusAreas?.length ? aboutData.focusAreas : [
                              'Agri-biotech, Food & Health, Climate-smart Farming',
                              'Farm Mechanization & Smart Equipment',
                              'Data, AI & IoT for Agriculture',
                            ]);
                            setAboutHowToApplyForm(aboutData.howToApply?.length ? aboutData.howToApply : [
                              'Prepare a brief concept note or problem statement.',
                              'Email: info.sauric@gmail.com (Subject: "RIC–SAU Application")',
                              'Process: Shortlisting → Mentoring → Lab Access → Pilot → Demo Day/Market',
                            ]);
                          }}>
                            <Edit3 className="h-4 w-4 mr-2" />Edit All Sections
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>Edit About Page Content</DialogTitle></DialogHeader>
                          <div className="space-y-6">
                            {/* Hero */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg border-b pb-2">Hero Section</h3>
                              <div><Label>Hero Title</Label><Input value={aboutForm.heroTitle} onChange={(e) => setAboutForm({ ...aboutForm, heroTitle: e.target.value })} /></div>
                              <div><Label>Hero Subtitle</Label><Textarea value={aboutForm.heroSubtitle} onChange={(e) => setAboutForm({ ...aboutForm, heroSubtitle: e.target.value })} rows={2} /></div>
                              <ImageUpload label="Hero Background Image" value={aboutForm.heroImage} onChange={(url) => setAboutForm({ ...aboutForm, heroImage: url })} enableCrop />
                            </div>

                            {/* Identity */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg border-b pb-2">RIC–SAU Identity</h3>
                              <RichTextEditor label="Identity Text" value={aboutForm.identity} onChange={(val) => setAboutForm({ ...aboutForm, identity: val })} rows={4} />
                            </div>

                            {/* Mission / Vision */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg border-b pb-2">Mission & Vision</h3>
                              <div><Label>Mission</Label><Textarea value={aboutForm.mission} onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })} rows={3} /></div>
                              <div><Label>Vision</Label><Textarea value={aboutForm.vision} onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })} rows={3} /></div>
                              <RichTextEditor label="Description" value={aboutForm.description} onChange={(val) => setAboutForm({ ...aboutForm, description: val })} rows={4} />
                              <div><Label>Established Year</Label><Input value={aboutForm.established} onChange={(e) => setAboutForm({ ...aboutForm, established: e.target.value })} placeholder="2020" /></div>
                              <ImageUpload label="About Page Image (What You Get section)" value={aboutForm.image} onChange={(url) => setAboutForm({ ...aboutForm, image: url })} enableCrop />
                            </div>

                            {/* Funding */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-semibold text-lg">Funding & Governance</h3>
                                <Button variant="outline" size="sm" onClick={() => setAboutFundingForm([...aboutFundingForm, { label: '', value: '' }])}><Plus className="h-3 w-3 mr-1" />Add</Button>
                              </div>
                              <ImageUpload label="Funding Section Image" value={aboutForm.fundingImage} onChange={(url) => setAboutForm({ ...aboutForm, fundingImage: url })} enableCrop />
                              {aboutFundingForm.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                  <div className="w-40"><Label>Label</Label><Input value={item.label} onChange={(e) => { const arr = [...aboutFundingForm]; arr[i] = { ...arr[i], label: e.target.value }; setAboutFundingForm(arr); }} placeholder="Financier" /></div>
                                  <div className="flex-1"><Label>Value</Label><Input value={item.value} onChange={(e) => { const arr = [...aboutFundingForm]; arr[i] = { ...arr[i], value: e.target.value }; setAboutFundingForm(arr); }} /></div>
                                  <Button variant="ghost" size="sm" className="mt-6 text-red-500" onClick={() => setAboutFundingForm(aboutFundingForm.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              ))}
                            </div>

                            {/* Who Can Apply */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-semibold text-lg">Who Can Apply</h3>
                                <Button variant="outline" size="sm" onClick={() => setAboutWhoCanApplyForm([...aboutWhoCanApplyForm, ''])}><Plus className="h-3 w-3 mr-1" />Add</Button>
                              </div>
                              {aboutWhoCanApplyForm.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                  <div className="flex-1"><Input value={item} onChange={(e) => { const arr = [...aboutWhoCanApplyForm]; arr[i] = e.target.value; setAboutWhoCanApplyForm(arr); }} /></div>
                                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setAboutWhoCanApplyForm(aboutWhoCanApplyForm.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              ))}
                            </div>

                            {/* What You Get */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-semibold text-lg">What You Get</h3>
                                <Button variant="outline" size="sm" onClick={() => setAboutWhatYouGetForm([...aboutWhatYouGetForm, ''])}><Plus className="h-3 w-3 mr-1" />Add</Button>
                              </div>
                              {aboutWhatYouGetForm.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                  <div className="flex-1"><Input value={item} onChange={(e) => { const arr = [...aboutWhatYouGetForm]; arr[i] = e.target.value; setAboutWhatYouGetForm(arr); }} /></div>
                                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setAboutWhatYouGetForm(aboutWhatYouGetForm.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              ))}
                            </div>

                            {/* Focus Areas */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-semibold text-lg">Focus Areas</h3>
                                <Button variant="outline" size="sm" onClick={() => setAboutFocusAreasForm([...aboutFocusAreasForm, ''])}><Plus className="h-3 w-3 mr-1" />Add</Button>
                              </div>
                              {aboutFocusAreasForm.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                  <div className="flex-1"><Input value={item} onChange={(e) => { const arr = [...aboutFocusAreasForm]; arr[i] = e.target.value; setAboutFocusAreasForm(arr); }} /></div>
                                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setAboutFocusAreasForm(aboutFocusAreasForm.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              ))}
                            </div>

                            {/* How to Apply */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-semibold text-lg">How to Apply</h3>
                                <Button variant="outline" size="sm" onClick={() => setAboutHowToApplyForm([...aboutHowToApplyForm, ''])}><Plus className="h-3 w-3 mr-1" />Add Step</Button>
                              </div>
                              {aboutHowToApplyForm.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                  <span className="mt-2 text-sm font-medium text-gray-500 w-6">{i + 1}.</span>
                                  <div className="flex-1"><Input value={item} onChange={(e) => { const arr = [...aboutHowToApplyForm]; arr[i] = e.target.value; setAboutHowToApplyForm(arr); }} /></div>
                                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setAboutHowToApplyForm(aboutHowToApplyForm.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              ))}
                              <div><Label>Application Email</Label><Input value={aboutForm.applyEmail} onChange={(e) => setAboutForm({ ...aboutForm, applyEmail: e.target.value })} placeholder="info.sauric@gmail.com" /></div>
                            </div>

                            {/* CTA */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg border-b pb-2">Call to Action</h3>
                              <div><Label>CTA Title</Label><Input value={aboutForm.ctaTitle} onChange={(e) => setAboutForm({ ...aboutForm, ctaTitle: e.target.value })} /></div>
                              <div><Label>CTA Subtitle</Label><Textarea value={aboutForm.ctaSubtitle} onChange={(e) => setAboutForm({ ...aboutForm, ctaSubtitle: e.target.value })} rows={2} /></div>
                            </div>

                            <Button onClick={handleUpdateAbout} className="w-full" size="lg">Save All About Page Content</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-3">Hero Section</h3>
                        <p><strong>Title:</strong> {aboutData.heroTitle || <span className="text-gray-400 italic">Default</span>}</p>
                        <p><strong>Subtitle:</strong> {aboutData.heroSubtitle || <span className="text-gray-400 italic">Default</span>}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-3">Mission & Vision</h3>
                        <p><strong>Mission:</strong> {aboutData.mission || <span className="text-gray-400 italic">Not set</span>}</p>
                        <p><strong>Vision:</strong> {aboutData.vision || <span className="text-gray-400 italic">Not set</span>}</p>
                        <p><strong>Established:</strong> {aboutData.established || <span className="text-gray-400 italic">Not set</span>}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Funding Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Funding & Governance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(aboutData.funding && aboutData.funding.length > 0 ? aboutData.funding : []).map((item: any, i: number) => (
                        <p key={i}><strong>{item.label}:</strong> {item.value}</p>
                      ))}
                      {(!aboutData.funding || aboutData.funding.length === 0) && (
                        <p className="text-gray-400 italic">Using defaults. Click &quot;Edit All Sections&quot; to customize.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Lists Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Who Can Apply</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {(aboutData.whoCanApply?.length ? aboutData.whoCanApply : ['Using defaults']).map((item: string, i: number) => (
                          <li key={i} className="text-gray-600">• {item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-base">What You Get</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {(aboutData.whatYouGet?.length ? aboutData.whatYouGet : ['Using defaults']).map((item: string, i: number) => (
                          <li key={i} className="text-gray-600">• {item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-base">Focus Areas</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {(aboutData.focusAreas?.length ? aboutData.focusAreas : ['Using defaults']).map((item: string, i: number) => (
                          <li key={i} className="text-gray-600">• {item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* CTA Preview */}
                <Card>
                  <CardHeader><CardTitle>Call to Action</CardTitle></CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <p className="font-semibold text-lg">{aboutData.ctaTitle || <span className="text-gray-400 italic">Default</span>}</p>
                      <p className="text-gray-600 mt-1">{aboutData.ctaSubtitle || <span className="text-gray-400 italic">Default</span>}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>Research Projects</CardTitle><CardDescription>Manage research projects and initiatives</CardDescription></div>
                    <Dialog open={dialogStates.project} onOpenChange={(open) => setDialogStates({ ...dialogStates, project: open })}>
                      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Project</Button></DialogTrigger>
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
                          <Button onClick={() => handleAdd('project', projectForm, resetProjectForm)} className="w-full">Add Project</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        {project.image && (
                          <img src={project.image} alt={project.title} className="w-20 h-20 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          {quickEditItem?.type === 'project' && quickEditItem.id === project.id ? (
                            <div className="space-y-2">
                              <Input
                                value={quickEditData.title || ''}
                                onChange={(e) => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                placeholder="Project title"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  value={quickEditData.category || ''}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, category: e.target.value })}
                                  placeholder="Category"
                                />
                                <Input
                                  value={quickEditData.lead || ''}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, lead: e.target.value })}
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
                          {quickEditItem?.type === 'project' && quickEditItem.id === project.id ? (
                            <>
                              <Button variant="outline" size="sm" onClick={saveQuickEdit}>Save</Button>
                              <Button variant="ghost" size="sm" onClick={cancelQuickEdit}>Cancel</Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => startQuickEdit('project', project)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="destructive" size="sm" onClick={() => handleDelete('project', project.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-center text-gray-500 py-8">No projects yet. Add your first project!</p>}
                    {projects.length > 0 && filteredProjects.length === 0 && <p className="text-center text-gray-500 py-8">No projects match your search.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Publications Tab */}
            <TabsContent value="publications">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>Research Publications</CardTitle><CardDescription>Manage research papers and publications</CardDescription></div>
                    <Dialog open={dialogStates.publication} onOpenChange={(open) => setDialogStates({ ...dialogStates, publication: open })}>
                      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Publication</Button></DialogTrigger>
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
                          <Button onClick={() => {
                            const formData = {
                              ...publicationForm,
                              authors: publicationForm.authors.split(',').map((s: string) => s.trim()).filter(Boolean),
                              keywords: publicationForm.keywords.split(',').map((s: string) => s.trim()).filter(Boolean),
                            };
                            handleAdd('publication', formData, resetPublicationForm);
                          }} className="w-full">Add Publication</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredPublications.map((pub: any) => (
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
                        <Button variant="destructive" size="sm" onClick={() => handleDelete('publication', pub.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    {publications.length === 0 && <p className="text-center text-gray-500 py-8">No publications yet. Add your first publication!</p>}
                    {publications.length > 0 && filteredPublications.length === 0 && <p className="text-center text-gray-500 py-8">No publications match your search.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Labs Tab */}
            <TabsContent value="labs">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>Research Labs</CardTitle><CardDescription>Manage research laboratories</CardDescription></div>
                    <Dialog open={dialogStates.lab} onOpenChange={(open) => setDialogStates({ ...dialogStates, lab: open })}>
                      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Lab</Button></DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Add New Lab</DialogTitle></DialogHeader>
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
                          <div><Label>Research Focus (comma-separated)</Label><Input value={labForm.focus} onChange={(e) => setLabForm({ ...labForm, focus: e.target.value })} placeholder="Machine Learning, Deep Learning, Computer Vision" /></div>
                          <div><Label>Equipment (comma-separated)</Label><Input value={labForm.equipment} onChange={(e) => setLabForm({ ...labForm, equipment: e.target.value })} placeholder="GPU Clusters, Workstations" /></div>
                          <ImageUpload label="Lab Image" value={labForm.image} onChange={(url) => setLabForm({ ...labForm, image: url })} enableCrop />
                          <Button onClick={() => {
                            const formData = {
                              ...labForm,
                              focus: labForm.focus.split(',').map((s: string) => s.trim()).filter(Boolean),
                              equipment: labForm.equipment.split(',').map((s: string) => s.trim()).filter(Boolean),
                            };
                            handleAdd('lab', formData, resetLabForm);
                          }} className="w-full">Add Lab</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredLabs.map((lab: any) => (
                      <div key={lab.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        {lab.image && (
                          <img src={lab.image} alt={lab.name} className="w-20 h-20 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{lab.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{lab.description?.substring(0, 100)}...</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Director: {lab.director}</span>
                            <span className="text-xs text-gray-500">{lab.members} members · {lab.projects} projects</span>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete('lab', lab.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    {labs.length === 0 && <p className="text-center text-gray-500 py-8">No labs yet. Add your first lab!</p>}
                    {labs.length > 0 && filteredLabs.length === 0 && <p className="text-center text-gray-500 py-8">No labs match your search.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>Resources</CardTitle><CardDescription>Manage RIC-SAU resources</CardDescription></div>
                    <Dialog open={dialogStates.resource} onOpenChange={(open) => setDialogStates({ ...dialogStates, resource: open })}>
                      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Resource</Button></DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Add New Resource</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div><Label>Title</Label><Input value={resourceForm.title} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} placeholder="Lab Space" /></div>
                          <div><Label>Description</Label><Textarea value={resourceForm.description} onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} rows={4} placeholder="Resource description..." /></div>
                          <ImageUpload label="Resource Image" value={resourceForm.image} onChange={(url) => setResourceForm({ ...resourceForm, image: url })} enableCrop />
                          <Button onClick={() => handleAdd('resource', resourceForm, resetResourceForm)} className="w-full">Add Resource</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredResources.map((resource: any) => (
                      <div key={resource.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        {resource.image && (
                          <img src={resource.image} alt={resource.title} className="w-20 h-20 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{resource.description?.substring(0, 100)}...</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete('resource', resource.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    {resources.length === 0 && <p className="text-center text-gray-500 py-8">No resources yet. Add your first resource!</p>}
                    {resources.length > 0 && filteredResources.length === 0 && <p className="text-center text-gray-500 py-8">No resources match your search.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>News & Articles</CardTitle><CardDescription>Manage news articles and press releases</CardDescription></div>
                    <Dialog open={dialogStates.news} onOpenChange={(open) => setDialogStates({ ...dialogStates, news: open })}>
                      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add News</Button></DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Add News Article</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div><Label>Title</Label><Input value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="Article title" /></div>
                          <div><Label>Excerpt (Summary)</Label><Textarea value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} rows={2} placeholder="Brief summary" /></div>
                          <RichTextEditor
                            label="Full Content"
                            value={newsForm.content}
                            onChange={(val) => setNewsForm({ ...newsForm, content: val })}
                            rows={8}
                            placeholder="Full article content with formatting..."
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <div><Label>Category</Label><Input value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} placeholder="Awards, Research..." /></div>
                            <div><Label>Read Time</Label><Input value={newsForm.readTime} onChange={(e) => setNewsForm({ ...newsForm, readTime: e.target.value })} placeholder="3 min read" /></div>
                          </div>
                          <ImageUpload 
                            label="News Image" 
                            value={newsForm.image} 
                            onChange={(url) => setNewsForm({ ...newsForm, image: url })}
                            enableCrop
                          />
                          <Button onClick={() => handleAdd('news', newsForm, resetNewsForm)} className="w-full">Add News</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredNews.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          {quickEditItem?.type === 'news' && quickEditItem.id === item.id ? (
                            <div className="space-y-2">
                              <Input
                                value={quickEditData.title || ''}
                                onChange={(e) => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                placeholder="News title"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  value={quickEditData.category || ''}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, category: e.target.value })}
                                  placeholder="Category"
                                />
                                <Input
                                  value={quickEditData.date || ''}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, date: e.target.value })}
                                  placeholder="Date"
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
                          {quickEditItem?.type === 'news' && quickEditItem.id === item.id ? (
                            <>
                              <Button variant="outline" size="sm" onClick={saveQuickEdit}>Save</Button>
                              <Button variant="ghost" size="sm" onClick={cancelQuickEdit}>Cancel</Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => startQuickEdit('news', item)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="destructive" size="sm" onClick={() => handleDelete('news', item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                    {news.length === 0 && <p className="text-center text-gray-500 py-8">No news articles yet. Add your first article!</p>}
                    {news.length > 0 && filteredNews.length === 0 && <p className="text-center text-gray-500 py-8">No news items match your search.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>Events</CardTitle><CardDescription>Manage upcoming and past events</CardDescription></div>
                    <Dialog open={dialogStates.event} onOpenChange={(open) => setDialogStates({ ...dialogStates, event: open })}>
                      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Event</Button></DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div><Label>Event Title</Label><Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Conference, Workshop, etc." /></div>
                          <div><Label>Description</Label><Textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} rows={4} /></div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><Label>Date</Label><Input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} /></div>
                            <div><Label>Time</Label><Input value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} placeholder="10:00 AM - 5:00 PM" /></div>
                          </div>
                          <div><Label>Location</Label><Input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="City, Country" /></div>
                          <div><Label>Category</Label><Input value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} placeholder="Conference, Summit, Workshop" /></div>
                          <ImageUpload 
                            label="Event Image" 
                            value={eventForm.image} 
                            onChange={(url) => setEventForm({ ...eventForm, image: url })}
                            enableCrop
                          />
                          <Button onClick={() => handleAdd('event', eventForm, resetEventForm)} className="w-full">Add Event</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        {event.image && (
                          <img src={event.image} alt={event.title} className="w-20 h-20 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          {quickEditItem?.type === 'event' && quickEditItem.id === event.id ? (
                            <div className="space-y-2">
                              <Input
                                value={quickEditData.title || ''}
                                onChange={(e) => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                placeholder="Event title"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <Input
                                  value={quickEditData.category || ''}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, category: e.target.value })}
                                  placeholder="Category"
                                />
                                <Input
                                  value={quickEditData.date || ''}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, date: e.target.value })}
                                  placeholder="Date"
                                />
                                <Input
                                  value={quickEditData.location || ''}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, location: e.target.value })}
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
                          {quickEditItem?.type === 'event' && quickEditItem.id === event.id ? (
                            <>
                              <Button variant="outline" size="sm" onClick={saveQuickEdit}>Save</Button>
                              <Button variant="ghost" size="sm" onClick={cancelQuickEdit}>Cancel</Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => startQuickEdit('event', event)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="destructive" size="sm" onClick={() => handleDelete('event', event.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                    {events.length === 0 && <p className="text-center text-gray-500 py-8">No events yet. Add your first event!</p>}
                    {events.length > 0 && filteredEvents.length === 0 && <p className="text-center text-gray-500 py-8">No events match your search.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>Team Members</CardTitle><CardDescription>Manage team member profiles</CardDescription></div>
                    <Dialog open={dialogStates.team} onOpenChange={(open) => setDialogStates({ ...dialogStates, team: open })}>
                      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Member</Button></DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div><Label>Name</Label><Input value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="Dr. John Doe" /></div>
                          <div><Label>Position</Label><Input value={teamForm.position} onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })} placeholder="Research Director" /></div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><Label>Department</Label><Input value={teamForm.department} onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })} placeholder="Research Department" /></div>
                            <div><Label>Email</Label><Input type="email" value={teamForm.email} onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })} placeholder="email@example.com" /></div>
                          </div>
                          <div><Label>Bio</Label><Textarea value={teamForm.bio} onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })} rows={3} placeholder="Professional bio and experience" /></div>
                          <ImageUpload 
                            label="Profile Photo" 
                            value={teamForm.image} 
                            onChange={(url) => setTeamForm({ ...teamForm, image: url })}
                            enableCrop
                            cropShape="circle"
                            cropShapeOptions={['circle', 'rect']}
                            optimizePreset="profile"
                          />
                          <Button onClick={() => handleAdd('team', teamForm, resetTeamForm)} className="w-full">Add Member</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTeam.map((member) => (
                      <div key={member.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        {member.image && (
                          <img src={member.image} alt={member.name} className="w-16 h-16 object-cover rounded-full" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.position}</p>
                          <p className="text-xs text-gray-500 mt-1">{member.department} • {member.email}</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete('team', member.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    {team.length === 0 && <p className="text-center text-gray-500 py-8">No team members yet. Add your first member!</p>}
                    {team.length > 0 && filteredTeam.length === 0 && <p className="text-center text-gray-500 py-8">No team members match your search.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Innovators Tab */}
            <TabsContent value="innovators">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>Innovators & Innovations</CardTitle><CardDescription>Manage innovations with RIPD codes, PI, and Co-PI details</CardDescription></div>
                    <Dialog open={dialogStates.innovator} onOpenChange={(open) => setDialogStates({ ...dialogStates, innovator: open })}>
                      <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Innovation</Button></DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Add Innovation</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div><Label>RIPD Code</Label><Input value={innovatorForm.ripd} onChange={(e) => setInnovatorForm({ ...innovatorForm, ripd: e.target.value })} placeholder="AGRI-2024-001" /></div>
                            <div><Label>Category</Label><Input value={innovatorForm.category} onChange={(e) => setInnovatorForm({ ...innovatorForm, category: e.target.value })} placeholder="AGRI, TECH, BIO, etc." /></div>
                          </div>
                          <div><Label>Innovation Title</Label><Input value={innovatorForm.title} onChange={(e) => setInnovatorForm({ ...innovatorForm, title: e.target.value })} placeholder="Smart Irrigation System for Arid Regions" /></div>
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
                          <Button onClick={() => handleAdd('innovator', innovatorForm, resetInnovatorForm)} className="w-full">Add Innovation</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredInnovators.map((innovator) => (
                      <div key={innovator.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        {innovator.image && (
                          <img src={innovator.image} alt={innovator.title || innovator.name} className="w-16 h-16 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                          {innovator.ripd && <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{innovator.ripd}</span>}
                          <h4 className="font-semibold mt-1">{innovator.title || innovator.name}</h4>
                          {innovator.pi && <p className="text-sm text-gray-600">PI: {innovator.pi}</p>}
                          {innovator.coPi && <p className="text-sm text-gray-500">Co-PI: {innovator.coPi}</p>}
                          {innovator.category && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">{innovator.category}</span>}
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete('innovator', innovator.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    {innovators.length === 0 && <p className="text-center text-gray-500 py-8">No innovations yet. Add your first innovation!</p>}
                    {innovators.length > 0 && filteredInnovators.length === 0 && <p className="text-center text-gray-500 py-8">No innovations match your search.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* RL Committee Tab */}
            <TabsContent value="rl-committee">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>RL Committee</CardTitle><CardDescription>Manage Research & Learning Committee members</CardDescription></div>
                    <Dialog open={dialogStates.rlCommittee} onOpenChange={(open) => setDialogStates({ ...dialogStates, rlCommittee: open })}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditingRlCommitteeId(null);
                            resetRlCommitteeForm();
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />Add Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>{editingRlCommitteeId ? 'Edit Committee Member' : 'Add Committee Member'}</DialogTitle></DialogHeader>
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
                            cropShapeOptions={['circle', 'rect']}
                            optimizePreset="profile"
                          />
                          <Button onClick={handleSaveRlCommittee} className="w-full">{editingRlCommitteeId ? 'Update Member' : 'Add Member'}</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredRlCommittee.map((member) => (
                      <div key={member.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                        {member.image && (
                          <img src={member.image} alt={member.name} className="w-16 h-16 object-cover rounded-full" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <p className="text-xs text-gray-500 mt-1">{member.department}</p>
                          <p className="text-xs text-gray-400 mt-1">Image: {member.imagePlacement || 'top'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingRlCommitteeId(member.id);
                              setRlCommitteeForm({
                                name: member.name || '',
                                role: member.role || '',
                                department: member.department || '',
                                email: member.email || '',
                                bio: member.bio || '',
                                image: member.image || '',
                                imagePlacement: member.imagePlacement || 'top',
                              });
                              setDialogStates({ ...dialogStates, rlCommittee: true });
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete('rlCommittee', member.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                    {rlCommittee.length === 0 && <p className="text-center text-gray-500 py-8">No committee members yet. Add your first member!</p>}
                    {rlCommittee.length > 0 && filteredRlCommittee.length === 0 && <p className="text-center text-gray-500 py-8">No committee members match your search.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>Contact Information</CardTitle><CardDescription>Manage contact details and office information</CardDescription></div>
                    <Dialog open={dialogStates.contact} onOpenChange={(open) => setDialogStates({ ...dialogStates, contact: open })}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setContactForm({ 
                          address: contactData.address || '', 
                          phone: contactData.phone || '', 
                          email: contactData.email || '', 
                          officeHours: contactData.officeHours || '' 
                        })}>
                          <Edit3 className="h-4 w-4 mr-2" />Edit Contact
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader><DialogTitle>Edit Contact Information</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <div><Label>Address</Label><Textarea value={contactForm.address} onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })} rows={2} /></div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><Label>Phone</Label><Input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} placeholder="+880..." /></div>
                            <div><Label>Email</Label><Input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} /></div>
                          </div>
                          <div><Label>Office Hours</Label><Input value={contactForm.officeHours} onChange={(e) => setContactForm({ ...contactForm, officeHours: e.target.value })} placeholder="Sunday - Thursday: 9:00 AM - 5:00 PM" /></div>
                          <Button onClick={handleUpdateContact} className="w-full">Update Contact</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p><strong>Address:</strong> {contactData.address}</p>
                    <p><strong>Phone:</strong> {contactData.phone}</p>
                    <p><strong>Email:</strong> {contactData.email}</p>
                    <p><strong>Office Hours:</strong> {contactData.officeHours}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Site Settings</CardTitle>
                        <CardDescription>Manage logo, branding, and site-wide settings</CardDescription>
                      </div>
                      <Dialog open={dialogStates.settings} onOpenChange={(open) => setDialogStates({ ...dialogStates, settings: open })}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSettingsForm({
                            siteName: siteSettings?.general?.siteName || '',
                            tagline: siteSettings?.general?.tagline || '',
                            description: siteSettings?.general?.description || '',
                            logo: siteSettings?.general?.logo || '',
                            favicon: siteSettings?.general?.favicon || '',
                            footerText: siteSettings?.general?.footerText || '',
                            facebook: siteSettings?.social?.facebook || '',
                            twitter: siteSettings?.social?.twitter || '',
                            linkedin: siteSettings?.social?.linkedin || '',
                            youtube: siteSettings?.social?.youtube || '',
                            instagram: siteSettings?.social?.instagram || ''
                          })}>
                            <Edit3 className="h-4 w-4 mr-2" />Edit Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>Site Settings</DialogTitle></DialogHeader>
                          <div className="space-y-6">
                            {/* General Settings */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg border-b pb-2">General Information</h3>
                              <div><Label>Site Name</Label><Input value={settingsForm.siteName} onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })} /></div>
                              <div><Label>Tagline</Label><Input value={settingsForm.tagline} onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })} /></div>
                              <div><Label>Description</Label><Textarea value={settingsForm.description} onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })} rows={3} /></div>
                              <div><Label>Footer Text</Label><Input value={settingsForm.footerText} onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })} /></div>
                            </div>

                            {/* Logo & Branding */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg border-b pb-2">Logo & Branding</h3>
                              <ImageUpload 
                                label="Site Logo (Header)" 
                                value={settingsForm.logo} 
                                onChange={(url) => setSettingsForm({ ...settingsForm, logo: url })}
                                enableCrop
                                optimizePreset="branding"
                              />
                              <ImageUpload 
                                label="Favicon (Browser Icon)" 
                                value={settingsForm.favicon} 
                                onChange={(url) => setSettingsForm({ ...settingsForm, favicon: url })}
                                enableCrop
                                optimizePreset="branding"
                              />
                            </div>

                            {/* Social Media */}
                            <div className="space-y-4">
                              <h3 className="font-semibold text-lg border-b pb-2">Social Media Links</h3>
                              <div><Label>Facebook</Label><Input value={settingsForm.facebook} onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })} placeholder="https://facebook.com/..." /></div>
                              <div><Label>Twitter</Label><Input value={settingsForm.twitter} onChange={(e) => setSettingsForm({ ...settingsForm, twitter: e.target.value })} placeholder="https://twitter.com/..." /></div>
                              <div><Label>LinkedIn</Label><Input value={settingsForm.linkedin} onChange={(e) => setSettingsForm({ ...settingsForm, linkedin: e.target.value })} placeholder="https://linkedin.com/..." /></div>
                              <div><Label>YouTube</Label><Input value={settingsForm.youtube} onChange={(e) => setSettingsForm({ ...settingsForm, youtube: e.target.value })} placeholder="https://youtube.com/..." /></div>
                              <div><Label>Instagram</Label><Input value={settingsForm.instagram} onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
                            </div>

                            <Button onClick={handleUpdateSettings} className="w-full">Save All Settings</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">General Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Site Name:</strong> {siteSettings?.general?.siteName}</p>
                          <p><strong>Tagline:</strong> {siteSettings?.general?.tagline}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Logo & Branding</h3>
                        <div className="flex gap-4">
                          {siteSettings?.general?.logo && (
                            <div>
                              <p className="text-sm mb-2"><strong>Logo:</strong></p>
                              <img src={siteSettings.general.logo} alt="Logo" className="h-16 w-auto border rounded p-2" />
                            </div>
                          )}
                          {siteSettings?.general?.favicon && (
                            <div>
                              <p className="text-sm mb-2"><strong>Favicon:</strong></p>
                              <img src={siteSettings.general.favicon} alt="Favicon" className="h-16 w-16 border rounded p-2" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Social Media</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Facebook:</strong> {siteSettings?.social?.facebook}</p>
                          <p><strong>Twitter:</strong> {siteSettings?.social?.twitter}</p>
                          <p><strong>LinkedIn:</strong> {siteSettings?.social?.linkedin}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
