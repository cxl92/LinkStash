import { BookmarkItem, Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-dev', name: 'Dev & AI', color: '#6366f1' },
  { id: 'cat-design', name: 'Design & UI', color: '#ec4899' },
  { id: 'cat-home', name: 'Home & Reno', color: '#f59e0b' },
  { id: 'cat-fitness', name: 'Fitness', color: '#10b981' },
  { id: 'cat-articles', name: 'Articles', color: '#06b6d4' },
];

export const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  {
    id: 'bm-1',
    url: 'https://ui.shadcn.com',
    title: 'shadcn/ui — Beautifully designed components',
    description:
      'Accessible and customizable components that you can copy and paste into your apps. Free and open source.',
    categoryId: 'cat-design',
    favorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'bm-2',
    url: 'https://linear.app/method',
    title: 'Linear Method — Principles & practices for modern software',
    description:
      'Opinionated guide on building high-velocity product teams, issue tracking, and crisp minimalist workflows.',
    categoryId: 'cat-articles',
    favorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 14,
  },
  {
    id: 'bm-3',
    url: 'https://raycast.com/store',
    title: 'Raycast Store — Productivity Extensions',
    description:
      'Supercharge your Mac workflow with community-built extensions for GitHub, Linear, Notion, and AI commands.',
    categoryId: 'cat-dev',
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
  },
  {
    id: 'bm-4',
    url: 'https://vercel.com/ai',
    title: 'Vercel AI SDK — Build AI-powered applications',
    description:
      'The TypeScript toolkit designed to help developers build AI-powered streaming text and generative UIs.',
    categoryId: 'cat-dev',
    favorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'bm-5',
    url: 'https://www.archdaily.com/search/projects/categories/interior-design',
    title: 'ArchDaily — Minimalist Interior & Renovation Projects',
    description:
      'Curated residential architecture, warm oak cabinetry ideas, and indirect lighting inspiration.',
    categoryId: 'cat-home',
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: 'bm-6',
    url: 'https://lucide.dev/icons',
    title: 'Lucide Icons — Beautiful & consistent icon toolkit',
    description:
      'Clean, lightweight open-source icon library maintained by the community for web and mobile apps.',
    categoryId: 'cat-design',
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
  },
  {
    id: 'bm-7',
    url: 'https://www.strongerbyscience.com/hypertrophy-range-fact-fiction/',
    title: 'Stronger By Science — Evidence-Based Hypertrophy Guide',
    description:
      'Deep dive into training volume, progressive overload, and effective rep ranges backed by exercise science.',
    categoryId: 'cat-fitness',
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
  },
  {
    id: 'bm-8',
    url: 'https://tailwindcss.com/docs/customizing-colors',
    title: 'Tailwind CSS — Customizing Colors & Design Tokens',
    description:
      'Reference palette for slate, zinc, and neutral shades for crisp light and dark mode interfaces.',
    categoryId: 'cat-design',
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 160,
  },
  {
    id: 'bm-9',
    url: 'https://news.ycombinator.com',
    title: 'Hacker News',
    description: 'Daily tech discussions, startup launches, and deep engineering writeups.',
    categoryId: '',
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 200,
  },
];

export const CATEGORY_COLORS = [
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#8b5cf6',
  '#f43f5e',
  '#64748b',
];

export function getDomain(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return 'No URL';
  try {
    const formatted =
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`;
    return new URL(formatted).hostname.replace(/^www\./, '');
  } catch {
    return trimmed;
  }
}

export function getFaviconUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  const domain = getDomain(trimmed);
  if (!domain || domain === 'No URL') return '';
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

export function generateTitleFromUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return 'Untitled Bookmark';
  try {
    const formatted =
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`;
    const parsed = new URL(formatted);
    const domain = parsed.hostname.replace(/^www\./, '');
    const siteName = domain.split('.')[0];
    const capitalizedSite = siteName.charAt(0).toUpperCase() + siteName.slice(1);

    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      const lastSlug = segments[segments.length - 1]
        .replace(/[-_]/g, ' ')
        .replace(/\.\w+$/, '')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      if (lastSlug.length > 2) {
        return `${lastSlug} — ${capitalizedSite}`;
      }
    }
    return `${capitalizedSite} (${domain})`;
  } catch {
    return trimmed;
  }
}

export function formatRelativeDate(timestamp: number): string {
  const diffMins = Math.floor((Date.now() - timestamp) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
