import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Return true when an image source should bypass Next.js optimization.
// Data URLs and external hosts other than well-known image CDNs should be left unoptimized.
export function shouldUseUnoptimized(src: string) {
  if (!src) return false;
  try {
    if (src.startsWith('data:') || src.startsWith('blob:')) return true;
    if (src.startsWith('/')) return false;
    // Allow pexels/unsplash/cloudinary to be optimized; otherwise treat unfamiliar remote hosts as unoptimized
    if (src.startsWith('http')) {
      return !src.includes('images.pexels.com') && !src.includes('images.unsplash.com') && !src.includes('res.cloudinary.com');
    }
  } catch (e) {
    return false;
  }
  return false;
}

export function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}
