import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic - no caching for real-time data
export const dynamic = 'force-dynamic';

// Helper to safely parse JSON fields
function parseJSON(value: string | null | undefined, fallback: any = {}) {
  if (!value) return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

// Default settings
const defaultSettings = {
  general: {
    siteName: 'Research & Innovation Center - SAU',
    tagline: 'Pioneering Agricultural Research & Technology Innovation',
    description: 'The Research & Innovation Center (RIC-SAU) is dedicated to advancing agricultural research and technology innovation.',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    footerText: 'Made with ❤️ for Research & Innovation'
  },
  seo: {
    metaTitle: 'Research & Innovation Center | Sher-e-Bangla Agricultural University',
    metaDescription: 'Leading research center for agricultural innovation and technology at Sher-e-Bangla Agricultural University, Dhaka, Bangladesh.',
    metaKeywords: 'research, innovation, agriculture, SAU, technology, Bangladesh',
    ogImage: '/og-image.jpg'
  },
  social: {
    facebook: 'https://facebook.com/sauric',
    twitter: 'https://twitter.com/sauric',
    linkedin: 'https://linkedin.com/company/sauric',
    youtube: 'https://youtube.com/@sauric',
    instagram: 'https://instagram.com/sauric'
  },
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    darkMode: false
  },
  features: {
    showNewsletterSignup: true,
    showVideoModal: true,
    enableComments: false,
    enableSearching: true,
    maintenanceMode: false
  }
};

async function getOrCreateSettings() {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        general: JSON.stringify(defaultSettings.general),
        seo: JSON.stringify(defaultSettings.seo),
        social: JSON.stringify(defaultSettings.social),
        theme: JSON.stringify(defaultSettings.theme),
        features: JSON.stringify(defaultSettings.features),
      }
    });
  }
  return settings;
}

function formatSettings(settings: any) {
  return {
    general: parseJSON(settings.general, defaultSettings.general),
    seo: parseJSON(settings.seo, defaultSettings.seo),
    social: parseJSON(settings.social, defaultSettings.social),
    theme: parseJSON(settings.theme, defaultSettings.theme),
    features: parseJSON(settings.features, defaultSettings.features),
  };
}

// -------------------- GET --------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    const settings = await getOrCreateSettings();
    const formatted = formatSettings(settings);

    let responseData;
    switch (section) {
      case 'general':
        responseData = { success: true, data: formatted.general };
        break;
      case 'seo':
        responseData = { success: true, data: formatted.seo };
        break;
      case 'social':
        responseData = { success: true, data: formatted.social };
        break;
      case 'theme':
        responseData = { success: true, data: formatted.theme };
        break;
      case 'features':
        responseData = { success: true, data: formatted.features };
        break;
      default:
        responseData = { success: true, data: formatted };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// -------------------- POST/PUT --------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data } = body;

    const settings = await getOrCreateSettings();
    const formatted = formatSettings(settings);

    const validSections = ['general', 'seo', 'social', 'theme', 'features'];
    if (!validSections.includes(section)) {
      return NextResponse.json({ success: false, error: 'Invalid section' }, { status: 400 });
    }

    // Merge with existing section data
    const updatedSection = { ...formatted[section as keyof typeof formatted], ...data };
    
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: { [section]: JSON.stringify(updatedSection) }
    });

    return NextResponse.json({ success: true, data: formatSettings(updated) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
