import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bookmark,
  Search,
  Plus,
  Star,
  Folder,
  Hash,
  LayoutGrid,
  List,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Edit3,
  X,
  Sun,
  Moon,
  Menu,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Inbox,
  Layers,
  CheckSquare,
  Square,
  ArrowUpDown,
  Globe,
  FolderPlus,
  Command
} from 'lucide-react';

// --- INITIAL SAMPLE DATA ---
const DEFAULT_CATEGORIES = [
  { id: 'cat-dev', name: 'Dev & AI', color: '#6366f1' },      // Indigo
  { id: 'cat-design', name: 'Design & UI', color: '#ec4899' }, // Pink
  { id: 'cat-home', name: 'Home & Reno', color: '#f59e0b' },   // Amber
  { id: 'cat-fitness', name: 'Fitness', color: '#10b981' },    // Emerald
  { id: 'cat-articles', name: 'Articles', color: '#06b6d4' },  // Cyan
];

const DEFAULT_BOOKMARKS = [
  {
    id: 'bm-1',
    url: 'https://ui.shadcn.com',
    title: 'shadcn/ui — Beautifully designed components',
    description: 'Accessible and customizable components that you can copy and paste into your apps. Free and open source.',
    categoryId: 'cat-design',
    tags: ['react', 'ui', 'components', 'tailwind'],
    favorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'bm-2',
    url: 'https://linear.app/method',
    title: 'Linear Method — Principles & practices for modern software',
    description: 'Opinionated guide on building high-velocity product teams, issue tracking, and crisp minimalist workflows.',
    categoryId: 'cat-articles',
    tags: ['product', 'minimalist', 'workflow'],
    favorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 14,
  },
  {
    id: 'bm-3',
    url: 'https://raycast.com/store',
    title: 'Raycast Store — Productivity Extensions',
    description: 'Supercharge your Mac workflow with community-built extensions for GitHub, Linear, Notion, and AI commands.',
    categoryId: 'cat-dev',
    tags: ['tools', 'productivity', 'mac'],
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
  },
  {
    id: 'bm-4',
    url: 'https://vercel.com/ai',
    title: 'Vercel AI SDK — Build AI-powered applications',
    description: 'The TypeScript toolkit designed to help developers build AI-powered streaming text and generative UIs.',
    categoryId: 'cat-dev',
    tags: ['ai', 'typescript', 'react', 'sdk'],
    favorite: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'bm-5',
    url: 'https://www.archdaily.com/search/projects/categories/interior-design',
    title: 'ArchDaily — Minimalist Interior & Renovation Projects',
    description: 'Curated residential architecture, warm oak cabinetry ideas, and indirect lighting inspiration.',
    categoryId: 'cat-home',
    tags: ['minimalist', 'interior', 'inspo'],
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: 'bm-6',
    url: 'https://lucide.dev/icons',
    title: 'Lucide Icons — Beautiful & consistent icon toolkit',
    description: 'Clean, lightweight open-source icon library maintained by the community for web and mobile apps.',
    categoryId: 'cat-design',
    tags: ['icons', 'ui', 'svg', 'reference'],
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
  },
  {
    id: 'bm-7',
    url: 'https://www.strongerbyscience.com/hypertrophy-range-fact-fiction/',
    title: 'Stronger By Science — Evidence-Based Hypertrophy Guide',
    description: 'Deep dive into training volume, progressive overload, and effective rep ranges backed by exercise science.',
    categoryId: 'cat-fitness',
    tags: ['hypertrophy', 'training', 'reference'],
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
  },
  {
    id: 'bm-8',
    url: 'https://tailwindcss.com/docs/customizing-colors',
    title: 'Tailwind CSS — Customizing Colors & Design Tokens',
    description: 'Reference palette for slate, zinc, and neutral shades for crisp light and dark mode interfaces.',
    categoryId: 'cat-design',
    tags: ['tailwind', 'css', 'reference'],
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 160,
  },
  {
    id: 'bm-9',
    url: 'https://news.ycombinator.com',
    title: 'Hacker News',
    description: 'Daily tech discussions, startup launches, and deep engineering writeups.',
    categoryId: '', // Uncategorized sample
    tags: ['tech', 'news'],
    favorite: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 200,
  },
];

const CATEGORY_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#64748b', // Slate
];

// --- HELPER FUNCTIONS ---
const getDomain = (url) => {
  try {
    const formatted = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    return new URL(formatted).hostname.replace(/^www\./, '');
  } catch {
    return 'example.com';
  }
};

const getFaviconUrl = (url) => {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
};

const generateTitleFromUrl = (url) => {
  try {
    const formatted = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
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
    return url;
  }
};

const formatRelativeDate = (timestamp) => {
  const diffMins = Math.floor((Date.now() - timestamp) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

// --- CUSTOM LINKSTASH LOGO COMPONENT (Ribbon LS Monogram) ---
const LinkStashLogo = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="LinkStash Logo"
  >
    <defs>
      <linearGradient id="linkstash-grad" x1="8" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06E5D4" />
        <stop offset="50%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    {/* Continuous Ribbon LS Monogram */}
    <path
      d="M21 14L13 42C11.5 47.2 15.4 51 20.5 51C25.2 51 28.5 47.2 33 43.5C37.5 39.8 41.5 38 46.5 38C51 38 54 40.8 54 44.8C54 49 50.2 52 44.5 52H34"
      stroke="url(#linkstash-grad)"
      strokeWidth="6.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M52 16H36C31.2 16 28 18.8 28 22.8C28 26.8 31.2 29.5 36.5 29.5H45.5C50.5 29.5 53.5 32.2 53.5 36"
      stroke="url(#linkstash-grad)"
      strokeWidth="6.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- MAIN COMPONENT ---
export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('linkstash_theme');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Data state
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('linkstash_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('linkstash_bookmarks');
      return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  });

  // Navigation & Filter state
  const [activeView, setActiveView] = useState('all'); // 'all' | 'favorites' | 'uncategorized' | categoryId
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'alpha'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState('');

  // Modal & Form states
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [formUrl, setFormUrl] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formTags, setFormTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [formFavorite, setFormFavorite] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);

  // New Category inline creator
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(CATEGORY_COLORS[0]);

  // Toast notification state
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const searchInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('linkstash_theme', JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('linkstash_categories', JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('linkstash_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  // Helper: Show Toast
  const showToast = (message, type = 'default') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3000);
  };

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        if (isBookmarkModalOpen) setIsBookmarkModalOpen(false);
        if (selectedIds.length > 0) setSelectedIds([]);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookmarkModalOpen, selectedIds.length, mobileMenuOpen]);

  // Global Paste Listener (Ctrl+V / Cmd+V outside inputs opens Add Bookmark Modal)
  useEffect(() => {
    const handlePaste = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isInputFocused =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        document.activeElement?.isContentEditable;

      if (isInputFocused || isBookmarkModalOpen) return;

      const pastedText = e.clipboardData?.getData('text')?.trim();
      if (pastedText && /^(https?:\/\/|www\.)[^\s]+$/i.test(pastedText)) {
        e.preventDefault();
        const normalizedUrl = pastedText.startsWith('http') ? pastedText : `https://${pastedText}`;
        openCreateModal(normalizedUrl);
        showToast('URL detected from clipboard!', 'info');
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isBookmarkModalOpen, activeView]);

  // Derived Counts & Tags
  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((c) => (counts[c.id] = 0));
    let uncategorized = 0;
    let favorites = 0;

    bookmarks.forEach((bm) => {
      if (bm.favorite) favorites++;
      if (bm.categoryId && counts[bm.categoryId] !== undefined) {
        counts[bm.categoryId]++;
      } else {
        uncategorized++;
      }
    });

    return { counts, uncategorized, favorites, total: bookmarks.length };
  }, [bookmarks, categories]);

  const allTags = useMemo(() => {
    const tagMap = {};
    bookmarks.forEach((bm) => {
      (bm.tags || []).forEach((t) => {
        tagMap[t] = (tagMap[t] || 0) + 1;
      });
    });
    return Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [bookmarks]);

  // Filtered & Sorted Bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks
      .filter((bm) => {
        // View filter
        if (activeView === 'favorites' && !bm.favorite) return false;
        if (activeView === 'uncategorized' && bm.categoryId) return false;
        if (
          activeView !== 'all' &&
          activeView !== 'favorites' &&
          activeView !== 'uncategorized' &&
          bm.categoryId !== activeView
        ) {
          return false;
        }

        // Tag filter
        if (selectedTag && !(bm.tags || []).includes(selectedTag)) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const catName = categories.find((c) => c.id === bm.categoryId)?.name?.toLowerCase() || '';
          const matchTitle = bm.title.toLowerCase().includes(q);
          const matchUrl = bm.url.toLowerCase().includes(q);
          const matchDesc = (bm.description || '').toLowerCase().includes(q);
          const matchCat = catName.includes(q);
          const matchTags = (bm.tags || []).some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchUrl || matchDesc || matchCat || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'oldest') return a.createdAt - b.createdAt;
        if (sortBy === 'alpha') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [bookmarks, activeView, selectedTag, searchQuery, sortBy, categories]);

  // Modal Handlers
  const openCreateModal = (prefillUrl = '') => {
    setEditingBookmark(null);
    setFormUrl(prefillUrl);
    setFormTitle(prefillUrl ? generateTitleFromUrl(prefillUrl) : '');
    setFormDescription('');
    const defaultCat =
      activeView !== 'all' && activeView !== 'favorites' && activeView !== 'uncategorized'
        ? activeView
        : categories[0]?.id || '';
    setFormCategoryId(defaultCat);
    setFormTags([]);
    setTagInput('');
    setFormFavorite(activeView === 'favorites');
    setIsBookmarkModalOpen(true);
  };

  const openEditModal = (bm) => {
    setEditingBookmark(bm);
    setFormUrl(bm.url);
    setFormTitle(bm.title);
    setFormDescription(bm.description || '');
    setFormCategoryId(bm.categoryId || '');
    setFormTags(bm.tags || []);
    setTagInput('');
    setFormFavorite(Boolean(bm.favorite));
    setIsBookmarkModalOpen(true);
  };

  const handleSmartAutoFill = () => {
    if (!formUrl.trim()) {
      showToast('Enter a URL first to auto-fill metadata');
      return;
    }
    setAutoFilling(true);
    setTimeout(() => {
      const normalized =
        formUrl.startsWith('http://') || formUrl.startsWith('https://')
          ? formUrl.trim()
          : `https://${formUrl.trim()}`;
      setFormUrl(normalized);
      if (!formTitle.trim()) {
        setFormTitle(generateTitleFromUrl(normalized));
      }
      const domain = getDomain(normalized);
      if (!formDescription.trim()) {
        setFormDescription(`Saved resource from ${domain}. Quick reference bookmark.`);
      }
      const domainTag = domain.split('.')[0].toLowerCase();
      if (domainTag && !formTags.includes(domainTag) && domainTag !== 'www') {
        setFormTags((prev) => [...prev, domainTag]);
      }
      setAutoFilling(false);
      showToast('Auto-filled title & favicon metadata');
    }, 350);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = tagInput.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9-_]/g, '');
      if (cleaned && !formTags.includes(cleaned)) {
        setFormTags([...formTags, cleaned]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && formTags.length > 0) {
      setFormTags(formTags.slice(0, -1));
    }
  };

  const handleSaveBookmark = (e) => {
    e.preventDefault();
    if (!formUrl.trim()) return;

    const normalizedUrl =
      formUrl.startsWith('http://') || formUrl.startsWith('https://')
        ? formUrl.trim()
        : `https://${formUrl.trim()}`;

    const finalTitle = formTitle.trim() || generateTitleFromUrl(normalizedUrl);
    const pendingTag = tagInput.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9-_]/g, '');
    const finalTags = pendingTag && !formTags.includes(pendingTag) ? [...formTags, pendingTag] : formTags;

    if (editingBookmark) {
      setBookmarks((prev) =>
        prev.map((bm) =>
          bm.id === editingBookmark.id
            ? {
                ...bm,
                url: normalizedUrl,
                title: finalTitle,
                description: formDescription.trim(),
                categoryId: formCategoryId,
                tags: finalTags,
                favorite: formFavorite,
              }
            : bm
        )
      );
      showToast('Bookmark updated');
    } else {
      const newBm = {
        id: `bm-${Date.now()}`,
        url: normalizedUrl,
        title: finalTitle,
        description: formDescription.trim(),
        categoryId: formCategoryId,
        tags: finalTags,
        favorite: formFavorite,
        createdAt: Date.now(),
      };
      setBookmarks((prev) => [newBm, ...prev]);
      showToast('Bookmark saved to LinkStash');
    }

    setIsBookmarkModalOpen(false);
  };

  // Bookmark Quick Actions
  const toggleFavorite = (id) => {
    setBookmarks((prev) =>
      prev.map((bm) => (bm.id === id ? { ...bm, favorite: !bm.favorite } : bm))
    );
  };

  const deleteBookmark = (id) => {
    setBookmarks((prev) => prev.filter((bm) => bm.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showToast('Bookmark deleted');
  };

  const copyUrl = (id, url) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    showToast('URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Bulk Selection Actions
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllVisible = () => {
    if (selectedIds.length === filteredBookmarks.length && filteredBookmarks.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBookmarks.map((b) => b.id));
    }
  };

  const handleBulkDelete = () => {
    const count = selectedIds.length;
    setBookmarks((prev) => prev.filter((bm) => !selectedIds.includes(bm.id)));
    setSelectedIds([]);
    showToast(`Deleted ${count} bookmark${count > 1 ? 's' : ''}`);
  };

  const handleBulkMoveCategory = (targetCatId) => {
    const count = selectedIds.length;
    setBookmarks((prev) =>
      prev.map((bm) => (selectedIds.includes(bm.id) ? { ...bm, categoryId: targetCatId } : bm))
    );
    setSelectedIds([]);
    setBulkCategoryTarget('');
    showToast(`Moved ${count} bookmark${count > 1 ? 's' : ''}`);
  };

  // Category Management
  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      color: newCatColor,
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setIsAddingCategory(false);
    setActiveView(newCat.id);
    showToast(`Category "${newCat.name}" created`);
  };

  const handleDeleteCategory = (catId, e) => {
    e.stopPropagation();
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    setBookmarks((prev) =>
      prev.map((bm) => (bm.categoryId === catId ? { ...bm, categoryId: '' } : bm))
    );
    if (activeView === catId) setActiveView('all');
    showToast('Category removed (links moved to Uncategorized)');
  };

  // Export / Import / Reset Utilities
  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      categories,
      bookmarks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkstash-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON exported');
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.bookmarks)) {
          setBookmarks(parsed.bookmarks);
          if (Array.isArray(parsed.categories)) {
            setCategories(parsed.categories);
          }
          showToast(`Imported ${parsed.bookmarks.length} bookmarks`);
        } else {
          showToast('Invalid backup file format');
        }
      } catch {
        showToast('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDemo = () => {
    setCategories(DEFAULT_CATEGORIES);
    setBookmarks(DEFAULT_BOOKMARKS);
    setActiveView('all');
    setSelectedTag(null);
    setSearchQuery('');
    setSelectedIds([]);
    setConfirmReset(false);
    showToast('Demo data restored');
  };

  // Current Header Title
  const currentViewTitle = useMemo(() => {
    if (activeView === 'all') return 'All Bookmarks';
    if (activeView === 'favorites') return 'Favorites';
    if (activeView === 'uncategorized') return 'Uncategorized';
    return categories.find((c) => c.id === activeView)?.name || 'Bookmarks';
  }, [activeView, categories]);

  const currentViewColor = useMemo(() => {
    return categories.find((c) => c.id === activeView)?.color || null;
  }, [activeView, categories]);

  // --- SIDEBAR CONTENT ---
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-50/80 dark:bg-slate-800/90 border border-cyan-200/60 dark:border-slate-700/80 flex items-center justify-center shadow-xs">
            <LinkStashLogo className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-slate-900 dark:text-white text-base">
              LinkStash
            </span>
            <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300">
              Pro
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Smart Views */}
        <div>
          <div className="px-2.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Library
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => {
                setActiveView('all');
                setSelectedTag(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'all' && !selectedTag
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 opacity-80" />
                All Bookmarks
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {categoryCounts.total}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveView('favorites');
                setSelectedTag(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'favorites'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-500" />
                Favorites
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {categoryCounts.favorites}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveView('uncategorized');
                setSelectedTag(null);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'uncategorized'
                  ? 'bg-slate-200/80 text-slate-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 opacity-80" />
                Uncategorized
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {categoryCounts.uncategorized}
              </span>
            </button>
          </nav>
        </div>

        {/* Custom Categories */}
        <div>
          <div className="px-2.5 mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Categories
            </span>
            <button
              onClick={() => setIsAddingCategory((v) => !v)}
              className="p-1 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Add Category"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inline Add Category Form */}
          {isAddingCategory && (
            <form
              onSubmit={handleCreateCategory}
              className="mb-2 p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <input
                type="text"
                placeholder="Category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                autoFocus
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {CATEGORY_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCatColor(color)}
                      className={`w-4 h-4 rounded-full transition-transform ${
                        newCatColor === color ? 'scale-125 ring-2 ring-offset-1 ring-slate-400 dark:ring-offset-slate-800' : 'opacity-75 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}

          <nav className="space-y-0.5">
            {categories.map((cat) => {
              const isActive = activeView === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setActiveView(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`group w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-200/80 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteCategory(cat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-slate-400 hover:text-red-600 transition-opacity"
                      title="Delete category"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {categoryCounts.counts[cat.id] || 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Tags Cloud */}
        <div>
          <div className="px-2.5 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tags
            </span>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {allTags.length === 0 ? (
            <p className="px-2.5 text-xs text-slate-400">No tags yet</p>
          ) : (
            <div className="px-2 flex flex-wrap gap-1.5">
              {allTags.map(({ tag, count }) => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(active ? null : tag);
                      setMobileMenuOpen(false);
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className="opacity-60">#</span>
                    {tag}
                    <span className={`text-[10px] ${active ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer Utilities */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleExportJson}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors"
            title="Export JSON backup"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors"
            title="Import JSON backup"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors px-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo Data
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-600 dark:text-amber-400 font-medium">Reset all?</span>
              <button
                onClick={handleResetDemo}
                className="text-red-600 dark:text-red-400 font-semibold hover:underline"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="text-slate-500 hover:underline"
              >
                No
              </button>
            </div>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden lg:block shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-all duration-200 overflow-hidden ${
            sidebarOpen ? 'w-64' : 'w-0 border-r-0'
          }`}
        >
          <div className="w-64 h-screen sticky top-0">{renderSidebarContent()}</div>
        </aside>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10">
              {renderSidebarContent()}
            </aside>
          </div>
        )}

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
            {/* Left: Sidebar Toggles & Search */}
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="hidden lg:flex p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Global Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookmarks, URLs, tags, or notes..."
                  className="w-full pl-9 pr-16 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">
                    <Command className="w-2.5 h-2.5" />K
                  </kbd>
                )}
              </div>
            </div>

            {/* Right: Controls & Add Button */}
            <div className="flex items-center gap-2 shrink-0">
              {/* View Switcher */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Visual Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Compact List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Add Bookmark CTA */}
              <button
                onClick={() => openCreateModal('')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Bookmark</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </header>

          {/* Subheader: Active Collection Title, Filters, Sort, Bulk Select */}
          <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                {currentViewColor && (
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentViewColor }}
                  />
                )}
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {currentViewTitle}
                </h1>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {filteredBookmarks.length}
                </span>
              </div>

              {/* Active Filters / Quick Paste Hint */}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {selectedTag ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium">
                    Filtered by #{selectedTag}
                    <button onClick={() => setSelectedTag(null)} className="hover:text-indigo-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : (
                  <span>
                    Tip: Press <kbd className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-[10px]">Ctrl+V</kbd> anywhere to quick-save a copied URL
                  </span>
                )}
              </div>
            </div>

            {/* Right Toolbar: Select All, Mobile View Toggle, Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {filteredBookmarks.length > 0 && (
                <button
                  onClick={toggleSelectAllVisible}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {selectedIds.length === filteredBookmarks.length && filteredBookmarks.length > 0 ? (
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  Select All
                </button>
              )}

              {/* Mobile View Mode Toggle */}
              <div className="flex sm:hidden items-center p-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-slate-500'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-slate-500'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex items-center">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alpha">Alphabetical (A–Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Bookmarks Area */}
          <main className="flex-1 px-4 sm:px-6 pb-24">
            {filteredBookmarks.length === 0 ? (
              /* Empty State */
              <div className="mt-12 max-w-md mx-auto text-center p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  No bookmarks found
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {searchQuery || selectedTag
                    ? 'Try clearing your search query or active tag filter.'
                    : 'Add your first URL to this collection or paste a link directly.'}
                </p>
                <div className="mt-5 flex items-center justify-center gap-2">
                  {(searchQuery || selectedTag) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTag(null);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => openCreateModal('')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Bookmark
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              /* VISUAL GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBookmarks.map((bm) => {
                  const category = categories.find((c) => c.id === bm.categoryId);
                  const domain = getDomain(bm.url);
                  const isSelected = selectedIds.includes(bm.id);

                  return (
                    <div
                      key={bm.id}
                      className={`group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 overflow-hidden hover:shadow-md ${
                        isSelected
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Top Visual Banner Header */}
                      <div
                        className="relative h-24 px-4 pt-3 flex items-start justify-between border-b border-slate-100 dark:border-slate-800/80"
                        style={{
                          background: category
                            ? `linear-gradient(135deg, ${category.color}18 0%, ${category.color}06 100%)`
                            : 'linear-gradient(135deg, rgba(100,116,139,0.10) 0%, rgba(100,116,139,0.03) 100%)',
                        }}
                      >
                        {/* Checkbox Select */}
                        <button
                          onClick={() => toggleSelect(bm.id)}
                          className={`p-1 rounded-lg transition-opacity ${
                            isSelected
                              ? 'opacity-100 text-indigo-600 dark:text-indigo-400'
                              : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white/80 dark:bg-slate-900/80'
                          }`}
                          title="Select bookmark"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        {/* Center Large Favicon */}
                        <a
                          href={bm.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/70 dark:border-slate-700 flex items-center justify-center overflow-hidden mt-1 group-hover:scale-105 transition-transform"
                        >
                          <img
                            src={getFaviconUrl(bm.url)}
                            alt={domain}
                            className="w-7 h-7 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </a>

                        {/* Favorite Star Button */}
                        <button
                          onClick={() => toggleFavorite(bm.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            bm.favorite
                              ? 'text-amber-500 bg-amber-500/10'
                              : 'text-slate-400 hover:text-amber-500 bg-white/70 dark:bg-slate-900/70 opacity-0 group-hover:opacity-100'
                          }`}
                          title={bm.favorite ? 'Unstar' : 'Add to Favorites'}
                        >
                          <Star className={`w-4 h-4 ${bm.favorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          {/* Domain & Category Pill */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
                              <Globe className="w-3 h-3 shrink-0" />
                              {domain}
                            </span>

                            {category && (
                              <span
                                onClick={() => setActiveView(category.id)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer shrink-0"
                                style={{
                                  backgroundColor: `${category.color}18`,
                                  color: category.color,
                                }}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <a
                            href={bm.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block font-semibold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2 leading-snug transition-colors"
                          >
                            {bm.title}
                          </a>

                          {/* Description */}
                          {bm.description && (
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {bm.description}
                            </p>
                          )}
                        </div>

                        {/* Footer: Tags & Hover Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 overflow-hidden flex-wrap max-h-6">
                            {(bm.tags || []).slice(0, 3).map((tag) => (
                              <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                  selectedTag === tag
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                              >
                                #{tag}
                              </button>
                            ))}
                            {(bm.tags || []).length > 3 && (
                              <span className="text-[10px] text-slate-400">
                                +{bm.tags.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Quick Action Icons */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => copyUrl(bm.id, bm.url)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Copy URL"
                            >
                              {copiedId === bm.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => openEditModal(bm)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteBookmark(bm.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={bm.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                              title="Open Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* COMPACT LIST VIEW */
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
                {filteredBookmarks.map((bm) => {
                  const category = categories.find((c) => c.id === bm.categoryId);
                  const domain = getDomain(bm.url);
                  const isSelected = selectedIds.includes(bm.id);

                  return (
                    <div
                      key={bm.id}
                      className={`group px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/60 dark:bg-indigo-500/10'
                          : 'hover:bg-slate-50/90 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Select Checkbox */}
                        <button
                          onClick={() => toggleSelect(bm.id)}
                          className={`shrink-0 ${
                            isSelected
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        {/* Favicon */}
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center shrink-0">
                          <img
                            src={getFaviconUrl(bm.url)}
                            alt={domain}
                            className="w-4 h-4 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>

                        {/* Title & Domain */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <a
                              href={bm.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                            >
                              {bm.title}
                            </a>
                            <span className="hidden md:inline text-xs text-slate-400 shrink-0">
                              {domain}
                            </span>
                          </div>
                          {bm.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {bm.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Middle Metadata: Category & Tags */}
                      <div className="hidden lg:flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          {(bm.tags || []).slice(0, 2).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                              className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>

                        {category && (
                          <span
                            onClick={() => setActiveView(category.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer"
                            style={{
                              backgroundColor: `${category.color}18`,
                              color: category.color,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 w-16 text-right">
                          {formatRelativeDate(bm.createdAt)}
                        </span>
                      </div>

                      {/* Row Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleFavorite(bm.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            bm.favorite
                              ? 'text-amber-500'
                              : 'text-slate-400 hover:text-amber-500 opacity-60 group-hover:opacity-100'
                          }`}
                          title="Favorite"
                        >
                          <Star className={`w-4 h-4 ${bm.favorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => copyUrl(bm.id, bm.url)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Copy URL"
                        >
                          {copiedId === bm.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(bm)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBookmark(bm.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a
                          href={bm.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                          title="Open Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

        {/* FLOATING BULK ACTION BAR */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white shadow-xl border border-slate-700 flex items-center gap-3 flex-wrap justify-center">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-600">
              {selectedIds.length} selected
            </span>

            <div className="h-4 w-px bg-slate-700" />

            {/* Move to Category */}
            <div className="flex items-center gap-1.5">
              <FolderPlus className="w-4 h-4 text-slate-400" />
              <select
                value={bulkCategoryTarget}
                onChange={(e) => handleBulkMoveCategory(e.target.value)}
                className="bg-slate-800 dark:bg-slate-900 text-xs text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="" disabled>
                  Move to category...
                </option>
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="p-1 text-slate-400 hover:text-white"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ADD / EDIT BOOKMARK MODAL */}
        {isBookmarkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setIsBookmarkModalOpen(false)}
            />

            <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50/80 dark:bg-slate-800 border border-cyan-200/60 dark:border-slate-700 flex items-center justify-center">
                    <LinkStashLogo className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {editingBookmark ? 'Edit Bookmark' : 'Save New Bookmark'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsBookmarkModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveBookmark} className="p-6 space-y-4">
                {/* URL + Smart Auto-Fill */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Website URL *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        required
                        placeholder="https://example.com/article"
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        autoFocus
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {formUrl ? (
                        <img
                          src={getFaviconUrl(formUrl)}
                          alt=""
                          className="w-4 h-4 rounded-xs absolute left-3 top-1/2 -translate-y-1/2"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSmartAutoFill}
                      disabled={autoFilling}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 border border-indigo-200/60 dark:border-indigo-500/30 transition-colors shrink-0"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${autoFilling ? 'animate-spin' : ''}`} />
                      {autoFilling ? 'Fetching...' : 'Auto-Fill'}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Page title (auto-generated if left blank)"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Category & Favorite Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Uncategorized</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Pin Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormFavorite((v) => !v)}
                      className={`w-full py-2 px-3 rounded-xl text-sm font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                        formFavorite
                          ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${formFavorite ? 'fill-current text-amber-500' : ''}`} />
                      {formFavorite ? 'Favorited' : 'Favorite'}
                    </button>
                  </div>
                </div>

                {/* Tags Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tags <span className="font-normal text-slate-400">(press Enter or comma)</span>
                  </label>
                  <div className="min-h-[42px] px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-indigo-500">
                    {formTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => setFormTags(formTags.filter((t) => t !== tag))}
                          className="hover:text-indigo-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={formTags.length === 0 ? 'e.g. react, design, tools...' : 'Add tag...'}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="flex-1 min-w-[100px] bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Short Note / Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Notes <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Why are you saving this link?"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                {/* Modal Actions */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBookmarkModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20 transition-colors"
                  >
                    {editingBookmark ? 'Save Changes' : 'Save Bookmark'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-lg flex items-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}