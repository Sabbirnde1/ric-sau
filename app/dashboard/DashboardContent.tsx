'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import Image from 'next/image';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import { ToastAction } from '@/components/ui/toast';
import ImageUpload from '@/components/ui/image-upload';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import NewsTab from '@/components/dashboard/tabs/NewsTab';
import EventsTab from '@/components/dashboard/tabs/EventsTab';
import ProjectsTab from '@/components/dashboard/tabs/ProjectsTab';
import PublicationsTab from '@/components/dashboard/tabs/PublicationsTab';
import LabsTab from '@/components/dashboard/tabs/LabsTab';
import ResourcesTab from '@/components/dashboard/tabs/ResourcesTab';
import TeamTab from '@/components/dashboard/tabs/TeamTab';
import InnovatorsTab from '@/components/dashboard/tabs/InnovatorsTab';
import RlCommitteeTab from '@/components/dashboard/tabs/RlCommitteeTab';

const shouldUseUnoptimized = (src: string) =>
  src.startsWith('data:') || (src.startsWith('http') && !src.includes('images.pexels.com'));

const LIST_PAGE_SIZE = 10;
type SearchableTab =
  | 'projects'
  | 'publications'
  | 'labs'
  | 'resources'
  | 'news'
  | 'events'
  | 'team'
  | 'innovators'
  | 'rl-committee';

const SEARCHABLE_TABS: ReadonlySet<SearchableTab> = new Set<SearchableTab>([
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

export default function DashboardContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [listSearch, setListSearch] = useState('');
  const [quickEditItem, setQuickEditItem] = useState<{ type: 'project' | 'news' | 'event'; id: number } | null>(null);
  const [quickEditData, setQuickEditData] = useState<Record<string, any>>({});
  const pendingDeleteRef = useRef<Record<string, { timeoutId: ReturnType<typeof setTimeout>; item: any; type: string }>>({});
  const draftsSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tabPage, setTabPage] = useState<Record<SearchableTab, number>>({
    projects: 1,
    publications: 1,
    labs: 1,
    resources: 1,
    news: 1,
    events: 1,
    team: 1,
    innovators: 1,
    'rl-committee': 1,
  });
  
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
    if (draftsSaveTimeoutRef.current) {
      clearTimeout(draftsSaveTimeoutRef.current);
    }

    draftsSaveTimeoutRef.current = setTimeout(() => {
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
    }, 600);

    return () => {
      if (draftsSaveTimeoutRef.current) {
        clearTimeout(draftsSaveTimeoutRef.current);
      }
    };
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
      if (draftsSaveTimeoutRef.current) {
        clearTimeout(draftsSaveTimeoutRef.current);
      }
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

  const fetchContentType = async (type: string) => {
    const response = await fetch(`/api/content?type=${type}`);
    const json = await response.json();
    return json.data;
  };

  const refreshSection = async (section: string) => {
    switch (section) {
      case 'home':
        setHomeData((await fetchContentType('home')) || {});
        break;
      case 'about':
        setAboutData((await fetchContentType('about')) || {});
        break;
      case 'projects':
      case 'project':
        setProjects((await fetchContentType('projects')) || []);
        break;
      case 'publications':
      case 'publication':
        setPublications((await fetchContentType('publications')) || []);
        break;
      case 'labs':
      case 'lab':
        setLabs((await fetchContentType('labs')) || []);
        break;
      case 'resources':
      case 'resource':
        setResources((await fetchContentType('resources')) || []);
        break;
      case 'news':
        setNews((await fetchContentType('news')) || []);
        break;
      case 'events':
      case 'event':
        setEvents((await fetchContentType('events')) || []);
        break;
      case 'team':
        setTeam((await fetchContentType('team')) || []);
        break;
      case 'innovators':
      case 'innovator':
        setInnovators((await fetchContentType('innovators')) || []);
        break;
      case 'rl-committee':
      case 'rlCommittee':
        setRlCommittee((await fetchContentType('rlCommittee')) || []);
        break;
      case 'contact':
        setContactData((await fetchContentType('contact')) || {});
        break;
      case 'settings': {
        const settingsRes = await fetch('/api/settings');
        const settingsJson = await settingsRes.json();
        setSiteSettings(settingsJson.data || {});
        break;
      }
      default:
        await fetchAllData();
        break;
    }
  };

  const refreshActiveTab = async () => {
    if (activeTab === 'overview') {
      await fetchAllData();
      return;
    }
    await refreshSection(activeTab);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem('adminUser');
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
        await refreshSection('home');
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
        await refreshSection('about');
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
        await refreshSection('contact');
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

      await refreshSection('settings');
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
      const json = await response.json();
      if (response.ok && json.success) {
        await refreshSection(type);
        resetForm();
        setDialogStates({ ...dialogStates, [type]: false });
        if (type === 'news') {
          clearDashboardDrafts(['news']);
        }
        toast({ title: 'Item added', description: 'New content item created successfully.' });
      } else {
        toast({ title: 'Create failed', description: json.error || `Could not add ${type}.`, variant: 'destructive' });
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
        await refreshSection('rlCommittee');
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
        await refreshSection(quickEditItem.type);
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

  useEffect(() => {
    if (!SEARCHABLE_TABS.has(activeTab as SearchableTab)) return;
    setTabPage((prev) => ({ ...prev, [activeTab as SearchableTab]: 1 }));
  }, [activeTab, listSearch]);

  const matchesSearch = useCallback((value: unknown) => {
    if (!listSearch.trim()) return true;
    return String(value ?? '').toLowerCase().includes(listSearch.toLowerCase().trim());
  }, [listSearch]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) =>
      matchesSearch(item.title) ||
      matchesSearch(item.description) ||
      matchesSearch(item.category) ||
      matchesSearch(item.lead)
    );
  }, [projects, matchesSearch]);

  const filteredPublications = useMemo(() => {
    return publications.filter((item) =>
      matchesSearch(item.title) ||
      matchesSearch((item.authors || []).join(' ')) ||
      matchesSearch(item.journal) ||
      matchesSearch(item.category)
    );
  }, [publications, matchesSearch]);

  const filteredLabs = useMemo(() => {
    return labs.filter((item) =>
      matchesSearch(item.name) ||
      matchesSearch(item.description) ||
      matchesSearch(item.director) ||
      matchesSearch(item.location)
    );
  }, [labs, matchesSearch]);

  const filteredResources = useMemo(() => {
    return resources.filter((item) => matchesSearch(item.title) || matchesSearch(item.description));
  }, [resources, matchesSearch]);

  const filteredNews = useMemo(() => {
    return news.filter((item) =>
      matchesSearch(item.title) ||
      matchesSearch(item.excerpt) ||
      matchesSearch(item.category)
    );
  }, [news, matchesSearch]);

  const filteredEvents = useMemo(() => {
    return events.filter((item) =>
      matchesSearch(item.title) ||
      matchesSearch(item.description) ||
      matchesSearch(item.category) ||
      matchesSearch(item.location)
    );
  }, [events, matchesSearch]);

  const filteredTeam = useMemo(() => {
    return team.filter((item) =>
      matchesSearch(item.name) ||
      matchesSearch(item.position) ||
      matchesSearch(item.department) ||
      matchesSearch(item.email)
    );
  }, [team, matchesSearch]);

  const filteredInnovators = useMemo(() => {
    return innovators.filter((item) =>
      matchesSearch(item.name) ||
      matchesSearch(item.title) ||
      matchesSearch(item.category) ||
      matchesSearch(item.ripd) ||
      matchesSearch(item.pi) ||
      matchesSearch(item.coPi)
    );
  }, [innovators, matchesSearch]);

  const filteredRlCommittee = useMemo(() => {
    return rlCommittee.filter((item) =>
      matchesSearch(item.name) ||
      matchesSearch(item.role) ||
      matchesSearch(item.department) ||
      matchesSearch(item.email)
    );
  }, [rlCommittee, matchesSearch]);

  const paginateItems = useCallback(<T,>(items: T[], tab: SearchableTab) => {
    const page = tabPage[tab] || 1;
    const start = (page - 1) * LIST_PAGE_SIZE;
    return items.slice(start, start + LIST_PAGE_SIZE);
  }, [tabPage]);

  const pagedFilteredProjects = useMemo(() => paginateItems(filteredProjects, 'projects'), [filteredProjects, paginateItems]);
  const pagedFilteredPublications = useMemo(() => paginateItems(filteredPublications, 'publications'), [filteredPublications, paginateItems]);
  const pagedFilteredLabs = useMemo(() => paginateItems(filteredLabs, 'labs'), [filteredLabs, paginateItems]);
  const pagedFilteredResources = useMemo(() => paginateItems(filteredResources, 'resources'), [filteredResources, paginateItems]);
  const pagedFilteredNews = useMemo(() => paginateItems(filteredNews, 'news'), [filteredNews, paginateItems]);
  const pagedFilteredEvents = useMemo(() => paginateItems(filteredEvents, 'events'), [filteredEvents, paginateItems]);
  const pagedFilteredTeam = useMemo(() => paginateItems(filteredTeam, 'team'), [filteredTeam, paginateItems]);
  const pagedFilteredInnovators = useMemo(() => paginateItems(filteredInnovators, 'innovators'), [filteredInnovators, paginateItems]);
  const pagedFilteredRlCommittee = useMemo(() => paginateItems(filteredRlCommittee, 'rl-committee'), [filteredRlCommittee, paginateItems]);

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

  const activePagination = useMemo(() => {
    if (!SEARCHABLE_TABS.has(activeTab as SearchableTab)) return null;
    const tab = activeTab as SearchableTab;
    const filtered = activeTabCount.filtered;
    const totalPages = Math.max(1, Math.ceil(filtered / LIST_PAGE_SIZE));
    const page = Math.min(tabPage[tab] || 1, totalPages);
    return { tab, page, totalPages };
  }, [activeTab, activeTabCount.filtered, tabPage]);

  useEffect(() => {
    if (!activePagination) return;
    const current = tabPage[activePagination.tab] || 1;
    if (current > activePagination.totalPages) {
      setTabPage((prev) => ({ ...prev, [activePagination.tab]: activePagination.totalPages }));
    }
  }, [activePagination, tabPage]);

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

          <DashboardStatsGrid
            projects={projects.length}
            publications={publications.length}
            labs={labs.length}
            news={news.length}
            events={events.length}
            team={team.length}
            innovators={innovators.length}
          />

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

            {SEARCHABLE_TABS.has(activeTab as SearchableTab) && (
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
                {activePagination && (
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={activePagination.page <= 1}
                      onClick={() =>
                        setTabPage((prev) => ({
                          ...prev,
                          [activePagination.tab]: Math.max(1, activePagination.page - 1),
                        }))
                      }
                    >
                      Prev
                    </Button>
                    <span className="text-xs text-gray-600 min-w-[74px] text-center">
                      Page {activePagination.page}/{activePagination.totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={activePagination.page >= activePagination.totalPages}
                      onClick={() =>
                        setTabPage((prev) => ({
                          ...prev,
                          [activePagination.tab]: Math.min(activePagination.totalPages, activePagination.page + 1),
                        }))
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setListSearch('');
                    refreshActiveTab();
                  }}
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
                            <div className="mt-2 relative w-full h-32 rounded overflow-hidden">
                              <Image
                                src={homeData.hero.backgroundImage}
                                alt="Hero"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                                unoptimized={shouldUseUnoptimized(homeData.hero.backgroundImage)}
                              />
                            </div>
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
              <ProjectsTab />
            </TabsContent>

            {/* Publications Tab */}
            <TabsContent value="publications">
              <PublicationsTab />
            </TabsContent>

            {/* Labs Tab */}
            <TabsContent value="labs">
              <LabsTab />
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources">
              <ResourcesTab />
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news">
              <NewsTab />
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <EventsTab />
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <TeamTab />
            </TabsContent>

            {/* Innovators Tab */}
            <TabsContent value="innovators">
              <InnovatorsTab />
            </TabsContent>

            {/* RL Committee Tab */}
            <TabsContent value="rl-committee">
              <RlCommitteeTab />
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
                              <div className="relative h-16 w-32 border rounded p-2 overflow-hidden">
                                <Image src={siteSettings.general.logo} alt="Logo" fill sizes="128px" className="object-contain p-2" unoptimized={shouldUseUnoptimized(siteSettings.general.logo)} />
                              </div>
                            </div>
                          )}
                          {siteSettings?.general?.favicon && (
                            <div>
                              <p className="text-sm mb-2"><strong>Favicon:</strong></p>
                              <div className="relative h-16 w-16 border rounded p-2 overflow-hidden">
                                <Image src={siteSettings.general.favicon} alt="Favicon" fill sizes="64px" className="object-contain p-2" unoptimized={shouldUseUnoptimized(siteSettings.general.favicon)} />
                              </div>
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
