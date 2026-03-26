import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 60;

// Helper to safely parse JSON fields
function parseJSON(value: string | null | undefined, fallback: any = null) {
  if (!value) return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

// Helper to format project for API response
function formatProject(p: any) {
  return { ...p, team: parseJSON(p.team, []), technologies: parseJSON(p.technologies, []) };
}

// Helper to format team member for API response
function formatTeamMember(t: any) {
  return { ...t, specializations: parseJSON(t.specializations, []), projects: parseJSON(t.projects, []) };
}

// Helper to format innovator for API response
function formatInnovator(i: any) {
  return { ...i, achievements: parseJSON(i.achievements, []) };
}

// Helper to format RL committee member for API response
function formatRlCommitteeMember(m: any) {
  const parsedBio = parseJSON(m.bio, null);
  if (parsedBio && typeof parsedBio === 'object') {
    const placement = ['top', 'left', 'right'].includes(parsedBio.imagePlacement)
      ? parsedBio.imagePlacement
      : 'top';
    return {
      ...m,
      bio: typeof parsedBio.text === 'string' ? parsedBio.text : '',
      imagePlacement: placement,
    };
  }

  return {
    ...m,
    bio: m.bio || '',
    imagePlacement: 'top',
  };
}

// Helper to format publication for API response
function formatPublication(p: any) {
  return { ...p, authors: parseJSON(p.authors, []), keywords: parseJSON(p.keywords, []) };
}

// Helper to format lab for API response
function formatLab(l: any) {
  return { ...l, focus: parseJSON(l.focus, []), equipment: parseJSON(l.equipment, []) };
}

// Helper to format home data for API response
function formatHome(h: any) {
  if (!h) return { hero: {}, stats: [], features: [], cta: {} };
  return {
    hero: parseJSON(h.hero, {}),
    stats: parseJSON(h.stats, []),
    features: parseJSON(h.features, []),
    cta: parseJSON(h.cta, {}),
  };
}

// Helper to format about data for API response
function formatAbout(a: any) {
  if (!a) return {};
  return {
    ...a,
    achievements: parseJSON(a.achievements, []),
    funding: parseJSON(a.funding, []),
    whoCanApply: parseJSON(a.whoCanApply, []),
    whatYouGet: parseJSON(a.whatYouGet, []),
    focusAreas: parseJSON(a.focusAreas, []),
    howToApply: parseJSON(a.howToApply, []),
  };
}

// -------------------- GET --------------------
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const rawLimit = parseInt(searchParams.get('limit') || '0', 10);
    const rawOffset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 0;
    const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0;
    const usePagination = Number.isFinite(limit) && limit > 0;

    const applyPagination = (query: any) => {
      if (!usePagination) return query;
      return {
        ...query,
        take: limit,
        skip: Math.max(0, offset),
      };
    };

    let data;
    let paginationMeta: { limit: number; offset: number } | null = null;
    switch (type) {
      case 'home': {
        const home = await prisma.home.findFirst();
        data = formatHome(home);
        break;
      }
      case 'about': {
        const about = await prisma.about.findFirst();
        data = about ? formatAbout(about) : {};
        break;
      }
      case 'projects': {
        const projects = await prisma.project.findMany(applyPagination({ orderBy: { createdAt: 'desc' } }));
        data = projects.map(formatProject);
        if (usePagination) paginationMeta = { limit, offset };
        break;
      }
      case 'news': {
        const news = await prisma.news.findMany(applyPagination({ orderBy: { createdAt: 'desc' } }));
        data = news;
        if (usePagination) paginationMeta = { limit, offset };
        break;
      }
      case 'team': {
        const team = await prisma.team.findMany(applyPagination({ orderBy: { createdAt: 'desc' } }));
        data = team.map(formatTeamMember);
        if (usePagination) paginationMeta = { limit, offset };
        break;
      }
      case 'events': {
        const events = await prisma.event.findMany(applyPagination({ orderBy: { date: 'desc' } }));
        data = events;
        if (usePagination) paginationMeta = { limit, offset };
        break;
      }
      case 'innovators': {
        const innovators = await prisma.innovator.findMany(applyPagination({ orderBy: { createdAt: 'desc' } }));
        data = innovators.map(formatInnovator);
        if (usePagination) paginationMeta = { limit, offset };
        break;
      }
      case 'rlCommittee': {
        const committee = await prisma.rlCommittee.findMany(applyPagination({ orderBy: { createdAt: 'desc' } }));
        data = committee.map(formatRlCommitteeMember);
        if (usePagination) paginationMeta = { limit, offset };
        break;
      }
      case 'publications': {
        const publications = await prisma.publication.findMany(applyPagination({ orderBy: { createdAt: 'desc' } }));
        data = publications.map(formatPublication);
        if (usePagination) paginationMeta = { limit, offset };
        break;
      }
      case 'labs': {
        const labs = await prisma.lab.findMany(applyPagination({ orderBy: { createdAt: 'desc' } }));
        data = labs.map(formatLab);
        if (usePagination) paginationMeta = { limit, offset };
        break;
      }
      case 'resources': {
        const resources = await prisma.resource.findMany(applyPagination({ orderBy: { createdAt: 'desc' } }));
        data = resources;
        if (usePagination) paginationMeta = { limit, offset };
        break;
      }
      case 'contact': {
        const contact = await prisma.contact.findFirst();
        data = contact || {};
        break;
      }
      default:
        data = {};
    }

    if (paginationMeta) {
      return NextResponse.json({ success: true, data, pagination: paginationMeta });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}

// -------------------- POST --------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;
    switch (type) {
      case 'project': {
        result = await prisma.project.create({
          data: {
            title: data.title || '',
            description: data.description || '',
            category: data.category || '',
            status: data.status || 'Active',
            lead: data.lead || '',
            startDate: data.startDate || '',
            budget: data.budget || 0,
            team: JSON.stringify(data.team || []),
            technologies: JSON.stringify(data.technologies || []),
            publications: 0,
            image: data.image || null,
          }
        });
        result = formatProject(result);
        break;
      }
      case 'news': {
        const slug = data.title
          ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : `news-${Date.now()}`;
        result = await prisma.news.create({
          data: {
            title: data.title || '',
            content: data.content || '',
            excerpt: data.excerpt || '',
            date: new Date().toISOString().split('T')[0],
            category: data.category || '',
            author: 'Admin',
            image: data.image || null,
            readTime: data.readTime || '3 min read',
            slug,
          }
        });
        break;
      }
      case 'team': {
        result = await prisma.team.create({
          data: {
            name: data.name || '',
            position: data.position || '',
            department: data.department || '',
            email: data.email || '',
            bio: data.bio || '',
            image: data.image || null,
            specializations: JSON.stringify(data.specializations || []),
            publications: 0,
            projects: JSON.stringify([]),
          }
        });
        result = formatTeamMember(result);
        break;
      }
      case 'event': {
        const eventSlug = data.title
          ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : `event-${Date.now()}`;
        result = await prisma.event.create({
          data: {
            title: data.title || '',
            description: data.description || '',
            date: data.date || '',
            time: data.time || '',
            location: data.location || '',
            category: data.category || '',
            image: data.image || null,
            slug: eventSlug,
          }
        });
        break;
      }
      case 'innovator': {
        result = await prisma.innovator.create({
          data: {
            name: data.name || '',
            title: data.title || '',
            bio: data.bio || '',
            specialization: data.specialization || '',
            image: data.image || null,
            achievements: JSON.stringify(data.achievements || []),
            ripd: data.ripd || '',
            pi: data.pi || '',
            coPi: data.coPi || '',
            category: data.category || '',
          }
        });
        result = formatInnovator(result);
        break;
      }
      case 'rlCommittee': {
        const placement = ['top', 'left', 'right'].includes(data.imagePlacement)
          ? data.imagePlacement
          : 'top';

        result = await prisma.rlCommittee.create({
          data: {
            name: data.name || '',
            role: data.role || '',
            department: data.department || '',
            email: data.email || '',
            bio: JSON.stringify({ text: data.bio || '', imagePlacement: placement }),
            image: data.image || null,
          }
        });
        result = formatRlCommitteeMember(result);
        break;
      }
      case 'home': {
        const existingHome = await prisma.home.findFirst();
        if (existingHome) {
          const currentHero = parseJSON(existingHome.hero, {});
          const currentStats = parseJSON(existingHome.stats, []);
          const currentFeatures = parseJSON(existingHome.features, []);
          const currentCta = parseJSON(existingHome.cta, {});
          const updatedHero = data.hero ? { ...currentHero, ...data.hero } : currentHero;
          const updatedStats = data.stats || currentStats;
          const updatedFeatures = data.features || currentFeatures;
          const updatedCta = data.cta ? { ...currentCta, ...data.cta } : currentCta;
          const updated = await prisma.home.update({
            where: { id: existingHome.id },
            data: {
              hero: JSON.stringify(updatedHero),
              stats: JSON.stringify(updatedStats),
              features: JSON.stringify(updatedFeatures),
              cta: JSON.stringify(updatedCta),
            }
          });
          result = formatHome(updated);
        } else {
          const created = await prisma.home.create({
            data: {
              hero: JSON.stringify(data.hero || {}),
              stats: JSON.stringify(data.stats || []),
              features: JSON.stringify(data.features || []),
              cta: JSON.stringify(data.cta || {}),
            }
          });
          result = formatHome(created);
        }
        break;
      }
      case 'about': {
        const existingAbout = await prisma.about.findFirst();
        const aboutFields: Record<string, any> = {
          mission: data.mission,
          vision: data.vision,
          description: data.description,
          established: data.established,
          image: data.image,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroImage: data.heroImage,
          identity: data.identity,
          fundingImage: data.fundingImage,
          applyEmail: data.applyEmail,
          ctaTitle: data.ctaTitle,
          ctaSubtitle: data.ctaSubtitle,
          achievements: data.achievements ? JSON.stringify(data.achievements) : undefined,
          funding: data.funding ? JSON.stringify(data.funding) : undefined,
          whoCanApply: data.whoCanApply ? JSON.stringify(data.whoCanApply) : undefined,
          whatYouGet: data.whatYouGet ? JSON.stringify(data.whatYouGet) : undefined,
          focusAreas: data.focusAreas ? JSON.stringify(data.focusAreas) : undefined,
          howToApply: data.howToApply ? JSON.stringify(data.howToApply) : undefined,
        };
        // Remove undefined values
        const cleanAboutData = Object.fromEntries(
          Object.entries(aboutFields).filter(([_, v]) => v !== undefined)
        );
        if (existingAbout) {
          const updated = await prisma.about.update({
            where: { id: existingAbout.id },
            data: cleanAboutData,
          });
          result = formatAbout(updated);
        } else {
          const created = await prisma.about.create({
            data: {
              mission: data.mission || '',
              vision: data.vision || '',
              description: data.description || '',
              established: data.established || '',
              image: data.image || null,
              achievements: JSON.stringify(data.achievements || []),
              heroTitle: data.heroTitle || 'Research & Innovation Center (RIC - SAU)',
              heroSubtitle: data.heroSubtitle || '',
              identity: data.identity || '',
              funding: JSON.stringify(data.funding || []),
              whoCanApply: JSON.stringify(data.whoCanApply || []),
              whatYouGet: JSON.stringify(data.whatYouGet || []),
              focusAreas: JSON.stringify(data.focusAreas || []),
              howToApply: JSON.stringify(data.howToApply || []),
            }
          });
          result = formatAbout(created);
        }
        break;
      }
      case 'publication': {
        result = await prisma.publication.create({
          data: {
            title: data.title || '',
            authors: JSON.stringify(data.authors || []),
            journal: data.journal || '',
            year: data.year || new Date().getFullYear(),
            category: data.category || '',
            type: data.type || 'Journal Article',
            citations: data.citations || 0,
            abstract: data.abstract || '',
            doi: data.doi || '',
            keywords: JSON.stringify(data.keywords || []),
          }
        });
        result = formatPublication(result);
        break;
      }
      case 'lab': {
        result = await prisma.lab.create({
          data: {
            name: data.name || '',
            director: data.director || '',
            location: data.location || '',
            established: parseInt(data.established) || new Date().getFullYear(),
            members: parseInt(data.members) || 0,
            focus: JSON.stringify(data.focus || []),
            description: data.description || '',
            equipment: JSON.stringify(data.equipment || []),
            projects: data.projects || 0,
            publications: data.publications || 0,
            image: data.image || null,
          }
        });
        result = formatLab(result);
        break;
      }
      case 'resource': {
        result = await prisma.resource.create({
          data: {
            title: data.title || '',
            description: data.description || '',
            image: data.image || null,
          }
        });
        break;
      }
      case 'contact': {
        const existingContact = await prisma.contact.findFirst();
        const contactFields = {
          address: data.address,
          phone: data.phone,
          email: data.email,
          officeHours: data.officeHours,
        };
        const cleanContactData = Object.fromEntries(
          Object.entries(contactFields).filter(([_, v]) => v !== undefined)
        );
        if (existingContact) {
          result = await prisma.contact.update({
            where: { id: existingContact.id },
            data: cleanContactData,
          });
        } else {
          result = await prisma.contact.create({
            data: {
              address: data.address || '',
              phone: data.phone || '',
              email: data.email || '',
              officeHours: data.officeHours || '',
            }
          });
        }
        break;
      }
      default:
        return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to create data' }, { status: 500 });
  }
}

// -------------------- PUT --------------------
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type, id, data } = body;
    const numericId = parseInt(id);

    let result;
    switch (type) {
      case 'project': {
        const updateData: any = { ...data };
        if (data.team) updateData.team = JSON.stringify(data.team);
        if (data.technologies) updateData.technologies = JSON.stringify(data.technologies);
        result = await prisma.project.update({ where: { id: numericId }, data: updateData });
        result = formatProject(result);
        break;
      }
      case 'news': {
        result = await prisma.news.update({ where: { id: numericId }, data });
        break;
      }
      case 'team': {
        const updateData: any = { ...data };
        if (data.specializations) updateData.specializations = JSON.stringify(data.specializations);
        if (data.projects) updateData.projects = JSON.stringify(data.projects);
        result = await prisma.team.update({ where: { id: numericId }, data: updateData });
        result = formatTeamMember(result);
        break;
      }
      case 'event': {
        result = await prisma.event.update({ where: { id: numericId }, data });
        break;
      }
      case 'innovator': {
        const updateData: any = { ...data };
        if (data.achievements) updateData.achievements = JSON.stringify(data.achievements);
        result = await prisma.innovator.update({ where: { id: numericId }, data: updateData });
        result = formatInnovator(result);
        break;
      }
      case 'rlCommittee': {
        const placement = ['top', 'left', 'right'].includes(data.imagePlacement)
          ? data.imagePlacement
          : 'top';

        const updateData: any = {
          name: data.name,
          role: data.role,
          department: data.department,
          email: data.email,
          image: data.image,
          bio: JSON.stringify({ text: data.bio || '', imagePlacement: placement }),
        };

        const cleanUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(([_, v]) => v !== undefined)
        );

        result = await prisma.rlCommittee.update({ where: { id: numericId }, data: cleanUpdateData });
        result = formatRlCommitteeMember(result);
        break;
      }
      case 'publication': {
        const updateData: any = { ...data };
        if (data.authors) updateData.authors = JSON.stringify(data.authors);
        if (data.keywords) updateData.keywords = JSON.stringify(data.keywords);
        result = await prisma.publication.update({ where: { id: numericId }, data: updateData });
        result = formatPublication(result);
        break;
      }
      case 'lab': {
        const updateData: any = { ...data };
        if (data.focus) updateData.focus = JSON.stringify(data.focus);
        if (data.equipment) updateData.equipment = JSON.stringify(data.equipment);
        result = await prisma.lab.update({ where: { id: numericId }, data: updateData });
        result = formatLab(result);
        break;
      }
      case 'resource': {
        result = await prisma.resource.update({ where: { id: numericId }, data });
        break;
      }
      case 'home': {
        const existingHome = await prisma.home.findFirst();
        if (existingHome) {
          const currentHero = parseJSON(existingHome.hero, {});
          const currentStats = parseJSON(existingHome.stats, []);
          const updatedHero = data.hero ? { ...currentHero, ...data.hero } : currentHero;
          const updatedStats = data.stats || currentStats;
          const updated = await prisma.home.update({
            where: { id: existingHome.id },
            data: { hero: JSON.stringify(updatedHero), stats: JSON.stringify(updatedStats) }
          });
          result = formatHome(updated);
        }
        break;
      }
      case 'about': {
        const existingAbout = await prisma.about.findFirst();
        if (existingAbout) {
          const aboutUpdate: any = { ...data };
          if (data.achievements) aboutUpdate.achievements = JSON.stringify(data.achievements);
          result = await prisma.about.update({ where: { id: existingAbout.id }, data: aboutUpdate });
          result = formatAbout(result);
        }
        break;
      }
      case 'contact': {
        const existingContact = await prisma.contact.findFirst();
        if (existingContact) {
          result = await prisma.contact.update({ where: { id: existingContact.id }, data });
        }
        break;
      }
      default:
        return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to update data' }, { status: 500 });
  }
}

// -------------------- DELETE --------------------
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ success: false, error: 'Missing type or id' }, { status: 400 });
    }

    const numericId = parseInt(id);

    switch (type) {
      case 'project':
        await prisma.project.delete({ where: { id: numericId } });
        break;
      case 'news':
        await prisma.news.delete({ where: { id: numericId } });
        break;
      case 'team':
        await prisma.team.delete({ where: { id: numericId } });
        break;
      case 'event':
        await prisma.event.delete({ where: { id: numericId } });
        break;
      case 'innovator':
        await prisma.innovator.delete({ where: { id: numericId } });
        break;
      case 'rlCommittee':
        await prisma.rlCommittee.delete({ where: { id: numericId } });
        break;
      case 'publication':
        await prisma.publication.delete({ where: { id: numericId } });
        break;
      case 'lab':
        await prisma.lab.delete({ where: { id: numericId } });
        break;
      case 'resource':
        await prisma.resource.delete({ where: { id: numericId } });
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to delete data' }, { status: 500 });
  }
}
