import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bookmark,
  Search,
  Plus,
  Star,
  LayoutGrid,
  List,
  Check,
  Trash2,
  X,
  Sun,
  Moon,
  Menu,
  Download,
  Upload,
  RotateCcw,
  Inbox,
  Layers,
  CheckSquare,
  Square,
  ArrowUpDown,
  FolderPlus,
  Command,
  Palette,
  Lock,
  Unlock,
  GripVertical,
} from 'lucide-react';
import {
  ActiveView,
  AppearanceSettings,
  BookmarkItem,
  Category,
  SortOption,
  ViewMode,
} from './types';
import {
  DEFAULT_APPEARANCE,
  THEME_PRESETS,
  applyAppearanceToDocument,
  resolveIsDark,
} from './themes';
import {
  CATEGORY_COLORS,
  DEFAULT_BOOKMARKS,
  DEFAULT_CATEGORIES,
} from './data/defaults';
import { LinkStashLogo } from './components/LinkStashLogo';
import { AppearanceModal } from './components/AppearanceModal';
import { BookmarkModal } from './components/BookmarkModal';
import { BookmarkCard } from './components/BookmarkCard';
import { BookmarkRow } from './components/BookmarkRow';

export default function App() {
  // Appearance & Theme state
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    try {
      const saved = localStorage.getItem('linkstash_appearance');
      if (saved) {
        return { ...DEFAULT_APPEARANCE, ...JSON.parse(saved) };
      }
      // Migrate legacy dark mode key if present
      const legacyDark = localStorage.getItem('linkstash_theme');
      if (legacyDark) {
        return {
          ...DEFAULT_APPEARANCE,
          colorMode: JSON.parse(legacyDark) ? 'dark' : 'light',
        };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_APPEARANCE;
  });

  const [isDarkActive, setIsDarkActive] = useState<boolean>(() =>
    resolveIsDark(appearance.colorMode)
  );
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState(false);

  // Data state
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('linkstash_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('linkstash_bookmarks');
      return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  });

  // Navigation & Filter state
  const [activeView, setActiveView] = useState<ActiveView>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('custom');
  const [arrangeLocked, setArrangeLocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('linkstash_arrange_locked');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);
  const [dragOverCatId, setDragOverCatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('linkstash_sidebar_width');
      const parsed = saved ? Number(saved) : 256;
      return Number.isFinite(parsed) ? Math.min(440, Math.max(210, parsed)) : 256;
    } catch {
      return 256;
    }
  });
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState('');

  // Bookmark Modal state
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<BookmarkItem | null>(null);
  const [prefillUrl, setPrefillUrl] = useState('');

  // New Category inline creator
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(CATEGORY_COLORS[0]);

  // Toast & UI feedback
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply theme CSS variables and dark class whenever appearance changes
  useEffect(() => {
    const dark = applyAppearanceToDocument(appearance);
    setIsDarkActive(dark);
    try {
      localStorage.setItem('linkstash_appearance', JSON.stringify(appearance));
    } catch {
      // ignore
    }
  }, [appearance]);

  // Listen to OS color scheme changes when colorMode === 'system'
  useEffect(() => {
    if (appearance.colorMode !== 'system' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const dark = applyAppearanceToDocument(appearance);
      setIsDarkActive(dark);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [appearance]);

  useEffect(() => {
    try {
      localStorage.setItem('linkstash_categories', JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('linkstash_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('linkstash_arrange_locked', JSON.stringify(arrangeLocked));
    } catch {
      // ignore
    }
  }, [arrangeLocked]);

  useEffect(() => {
    try {
      localStorage.setItem('linkstash_sidebar_width', String(sidebarWidth));
    } catch {
      // ignore
    }
  }, [sidebarWidth]);

  useEffect(() => {
    if (!isResizingSidebar) return;
    const handleMouseMove = (e: MouseEvent) => {
      const nextWidth = Math.min(440, Math.max(210, e.clientX));
      setSidebarWidth(nextWidth);
    };
    const handleMouseUp = () => {
      setIsResizingSidebar(false);
    };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar]);

  const showToast = (message: string, type = 'default') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3000);
  };

  const toggleDarkModeQuick = () => {
    const nextMode = isDarkActive ? 'light' : 'dark';
    setAppearance((prev) => ({ ...prev, colorMode: nextMode }));
  };

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        if (pendingDeleteIds) setPendingDeleteIds(null);
        if (isBookmarkModalOpen) setIsBookmarkModalOpen(false);
        if (isAppearanceModalOpen) setIsAppearanceModalOpen(false);
        if (selectedIds.length > 0) setSelectedIds([]);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingDeleteIds, isBookmarkModalOpen, isAppearanceModalOpen, selectedIds.length, mobileMenuOpen]);

  // Global Paste Listener (Ctrl+V / Cmd+V outside inputs opens Add Bookmark Modal)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const tag = activeEl?.tagName?.toLowerCase();
      const isInputFocused =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        activeEl?.isContentEditable;

      if (isInputFocused || isBookmarkModalOpen || isAppearanceModalOpen) return;

      const pastedText = e.clipboardData?.getData('text')?.trim();
      if (pastedText && /^(https?:\/\/|www\.)[^\s]+$/i.test(pastedText)) {
        e.preventDefault();
        const normalizedUrl = pastedText.startsWith('http')
          ? pastedText
          : `https://${pastedText}`;
        openCreateModal(normalizedUrl);
        showToast('URL detected from clipboard', 'info');
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isBookmarkModalOpen, isAppearanceModalOpen, activeView]);

  // Derived Counts & Tags
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
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

  // Filtered & Sorted Bookmarks
  const filteredBookmarks = useMemo(() => {
    const filtered = bookmarks.filter((bm) => {
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

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const catName =
          categories.find((c) => c.id === bm.categoryId)?.name?.toLowerCase() || '';
        const matchTitle = bm.title.toLowerCase().includes(q);
        const matchUrl = bm.url.toLowerCase().includes(q);
        const matchDesc = (bm.description || '').toLowerCase().includes(q);
        const matchCat = catName.includes(q);
        return matchTitle || matchUrl || matchDesc || matchCat;
      }

      return true;
    });

    if (sortBy === 'custom') return filtered;

    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'alpha') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [bookmarks, activeView, searchQuery, sortBy, categories]);

  // Modal Handlers
  const openCreateModal = (urlToPrefill = '') => {
    setEditingBookmark(null);
    setPrefillUrl(urlToPrefill);
    setIsBookmarkModalOpen(true);
  };

  const openEditModal = (bm: BookmarkItem) => {
    setEditingBookmark(bm);
    setPrefillUrl('');
    setIsBookmarkModalOpen(true);
  };

  const defaultModalCategory = '';

  const handleSaveBookmark = (data: {
    url: string;
    title: string;
    description: string;
    categoryId: string;
    favorite: boolean;
  }) => {
    if (editingBookmark) {
      setBookmarks((prev) =>
        prev.map((bm) =>
          bm.id === editingBookmark.id
            ? {
                ...bm,
                ...data,
              }
            : bm
        )
      );
      showToast('Bookmark updated');
    } else {
      const newBm: BookmarkItem = {
        id: `bm-${Date.now()}`,
        ...data,
        createdAt: Date.now(),
      };
      setBookmarks((prev) => [newBm, ...prev]);
      showToast('Bookmark saved to LinkStash');
    }
    setIsBookmarkModalOpen(false);
  };

  // Bookmark Quick Actions
  const toggleFavorite = (id: string) => {
    setBookmarks((prev) =>
      prev.map((bm) => (bm.id === id ? { ...bm, favorite: !bm.favorite } : bm))
    );
  };

  const deleteBookmark = (id: string) => {
    setPendingDeleteIds([id]);
  };

  const executeDeleteBookmarks = () => {
    if (!pendingDeleteIds || pendingDeleteIds.length === 0) return;

    const deleteSet = new Set(pendingDeleteIds);
    const affectedCategoryIds = new Set(
      bookmarks
        .filter((bm) => deleteSet.has(bm.id) && bm.categoryId)
        .map((bm) => bm.categoryId)
    );
    const nextBookmarks = bookmarks.filter((bm) => !deleteSet.has(bm.id));

    const emptyCategoryIds = new Set(
      Array.from(affectedCategoryIds).filter(
        (catId) => !nextBookmarks.some((bm) => bm.categoryId === catId)
      )
    );

    setBookmarks(nextBookmarks);
    setSelectedIds((prev) => prev.filter((id) => !deleteSet.has(id)));

    if (emptyCategoryIds.size > 0) {
      setCategories((prev) => prev.filter((c) => !emptyCategoryIds.has(c.id)));
      if (emptyCategoryIds.has(activeView)) {
        setActiveView('all');
      }
    }

    const deletedCount = pendingDeleteIds.length;
    setPendingDeleteIds(null);

    if (emptyCategoryIds.size > 0) {
      const catLabel = emptyCategoryIds.size === 1 ? 'empty category removed' : `${emptyCategoryIds.size} empty categories removed`;
      showToast(
        deletedCount === 1
          ? `Bookmark deleted (${catLabel})`
          : `Deleted ${deletedCount} bookmarks (${catLabel})`
      );
    } else {
      showToast(
        deletedCount === 1
          ? 'Bookmark deleted'
          : `Deleted ${deletedCount} bookmarks`
      );
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    showToast('URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Bulk Selection Actions
  const toggleSelect = (id: string) => {
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
    if (selectedIds.length === 0) return;
    setPendingDeleteIds([...selectedIds]);
  };

  const handleBulkMoveCategory = (targetCatId: string) => {
    const count = selectedIds.length;
    setBookmarks((prev) =>
      prev.map((bm) => (selectedIds.includes(bm.id) ? { ...bm, categoryId: targetCatId } : bm))
    );
    setSelectedIds([]);
    setBulkCategoryTarget('');
    showToast(`Moved ${count} bookmark${count > 1 ? 's' : ''}`);
  };

  // Category Management
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: Category = {
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

  const handleCreateCategoryInline = (name: string, color: string): Category => {
    const existing = categories.find(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existing) {
      showToast(`Selected existing category "${existing.name}"`);
      return existing;
    }
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      color,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created`);
    return newCat;
  };

  const handleDeleteCategory = (catId: string, e: React.MouseEvent) => {
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

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result || ''));
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
    setSearchQuery('');
    setSelectedIds([]);
    setConfirmReset(false);
    showToast('Demo data restored');
  };

  const handleStartBlank = () => {
    setCategories([]);
    setBookmarks([]);
    setActiveView('all');
    setIsAddingCategory(false);
    setSelectedIds([]);
    setSearchQuery('');
    setConfirmReset(false);
    showToast('Cleared all bookmarks and categories');
  };

  // Drag & Drop Self-Arrange Handlers
  const toggleArrangeLock = () => {
    const next = !arrangeLocked;
    setArrangeLocked(next);
    setDraggedId(null);
    setDragOverId(null);
    setDraggedCatId(null);
    setDragOverCatId(null);
    showToast(
      next
        ? 'Arrange locked for categories and bookmarks'
        : 'Arrange unlocked — drag categories or boxes to reorder'
    );
  };

  const handleDragStart = (id: string, e: React.DragEvent) => {
    if (arrangeLocked) return;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (id: string, e: React.DragEvent) => {
    if (arrangeLocked || !draggedId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (targetId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (arrangeLocked) return;
    const sourceId = draggedId || e.dataTransfer.getData('text/plain');
    setDraggedId(null);
    setDragOverId(null);
    if (!sourceId || sourceId === targetId) return;

    setBookmarks((prev) => {
      const base =
        sortBy === 'custom'
          ? [...prev]
          : [...prev].sort((a, b) => {
              if (sortBy === 'newest') return b.createdAt - a.createdAt;
              if (sortBy === 'oldest') return a.createdAt - b.createdAt;
              if (sortBy === 'alpha') return a.title.localeCompare(b.title);
              return 0;
            });

      const fromIndex = base.findIndex((b) => b.id === sourceId);
      const toIndex = base.findIndex((b) => b.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const [moved] = base.splice(fromIndex, 1);
      base.splice(toIndex, 0, moved);
      return base;
    });

    if (sortBy !== 'custom') {
      setSortBy('custom');
    }
    showToast('Order updated');
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  // Drag & Drop Category Reorder Handlers
  const handleCategoryDragStart = (catId: string, e: React.DragEvent) => {
    if (arrangeLocked) return;
    setDraggedCatId(catId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/x-linkstash-category', catId);
  };

  const handleCategoryDragOver = (catId: string, e: React.DragEvent) => {
    if (arrangeLocked || !draggedCatId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCatId !== catId) {
      setDragOverCatId(catId);
    }
  };

  const handleCategoryDrop = (targetCatId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (arrangeLocked) return;
    const sourceCatId =
      draggedCatId || e.dataTransfer.getData('application/x-linkstash-category');
    setDraggedCatId(null);
    setDragOverCatId(null);
    if (!sourceCatId || sourceCatId === targetCatId) return;

    setCategories((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((c) => c.id === sourceCatId);
      const toIndex = next.findIndex((c) => c.id === targetCatId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    showToast('Category order updated');
  };

  const handleCategoryDragEnd = () => {
    setDraggedCatId(null);
    setDragOverCatId(null);
  };

  const currentViewTitle = useMemo(() => {
    if (activeView === 'all') return 'All Bookmarks';
    if (activeView === 'favorites') return 'Favorites';
    if (activeView === 'uncategorized') return 'Uncategorized';
    return categories.find((c) => c.id === activeView)?.name || 'Bookmarks';
  }, [activeView, categories]);

  const currentViewColor = useMemo(() => {
    return categories.find((c) => c.id === activeView)?.color || null;
  }, [activeView, categories]);

  const activeThemeName = useMemo(() => {
    return THEME_PRESETS.find((t) => t.id === appearance.themeId)?.name || 'Custom';
  }, [appearance.themeId]);

  // --- SIDEBAR CONTENT ---
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full select-none bg-[var(--ls-surface)]">
      {/* Brand Header */}
      <div className="h-20 px-4 flex items-center justify-between border-b border-[var(--ls-border)] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <LinkStashLogo className="w-13 h-13 shrink-0" />
          <span className="font-display font-bold tracking-tight text-[var(--ls-text)] text-[26px] leading-none whitespace-nowrap truncate">
            LinkStash
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-[var(--ls-text-muted)] hover:bg-[var(--ls-surface-muted)]"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Library */}
        <div>
          <div className="px-2.5 mb-1.5 text-xs font-semibold text-[var(--ls-text-muted)]">
            Library
          </div>
          <nav className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setActiveView('all');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeView === 'all'
                  ? 'bg-[var(--ls-accent-soft)] text-[var(--ls-accent-text)]'
                  : 'text-[var(--ls-text-secondary)] hover:bg-[var(--ls-surface-muted)] hover:text-[var(--ls-text)]'
              }`}
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 opacity-80" />
                All Bookmarks
              </span>
              <span className="text-xs text-[var(--ls-text-muted)] tabular-nums">
                {categoryCounts.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('favorites');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeView === 'favorites'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                  : 'text-[var(--ls-text-secondary)] hover:bg-[var(--ls-surface-muted)] hover:text-[var(--ls-text)]'
              }`}
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              <span className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-500" />
                Favorites
              </span>
              <span className="text-xs text-[var(--ls-text-muted)] tabular-nums">
                {categoryCounts.favorites}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView('uncategorized');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeView === 'uncategorized'
                  ? 'bg-[var(--ls-surface-muted)] text-[var(--ls-text)]'
                  : 'text-[var(--ls-text-secondary)] hover:bg-[var(--ls-surface-muted)] hover:text-[var(--ls-text)]'
              }`}
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              <span className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 opacity-80" />
                Uncategorized
              </span>
              <span className="text-xs text-[var(--ls-text-muted)] tabular-nums">
                {categoryCounts.uncategorized}
              </span>
            </button>
          </nav>
        </div>

        {/* Categories */}
        <div>
          <div className="px-2.5 mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--ls-text-muted)]">
              Categories
            </span>
            <button
              type="button"
              onClick={() => setIsAddingCategory((v) => !v)}
              className="p-1 rounded hover:bg-[var(--ls-surface-muted)] text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] transition-colors cursor-pointer"
              title="Add Category"
              aria-label="Add Category"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isAddingCategory && (
            <form
              onSubmit={handleCreateCategory}
              className="mb-2 p-2.5 bg-[var(--ls-surface-muted)] border border-[var(--ls-border)] space-y-2"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              <input
                type="text"
                placeholder="Category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                autoFocus
                className="w-full px-2.5 py-1.5 text-xs bg-[var(--ls-surface)] border border-[var(--ls-border)] text-[var(--ls-text)] focus:outline-none focus:border-[var(--ls-accent)]"
                style={{ borderRadius: 'calc(var(--ls-radius-control) - 2px)' }}
              />
              <div className="space-y-2.5 pt-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {CATEGORY_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCatColor(color)}
                      className={`w-4 h-4 rounded-full transition-transform cursor-pointer shrink-0 ${
                        newCatColor === color
                          ? 'scale-120 ring-2 ring-offset-1 ring-[var(--ls-text)] ring-offset-[var(--ls-surface-muted)]'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-2.5 py-1 text-xs text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-medium rounded-md bg-[var(--ls-accent)] text-[var(--ls-accent-fg)] hover:bg-[var(--ls-accent-hover)] whitespace-nowrap shrink-0 cursor-pointer"
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
              const isDraggingCat = draggedCatId === cat.id;
              const isDropTargetCat =
                dragOverCatId === cat.id && draggedCatId !== cat.id;
              return (
                <div
                  key={cat.id}
                  draggable={!arrangeLocked}
                  onDragStart={(e) => handleCategoryDragStart(cat.id, e)}
                  onDragOver={(e) => handleCategoryDragOver(cat.id, e)}
                  onDrop={(e) => handleCategoryDrop(cat.id, e)}
                  onDragEnd={handleCategoryDragEnd}
                  onClick={() => {
                    setActiveView(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveView(cat.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`group w-full flex items-center justify-between px-2 py-2 text-sm font-medium transition-all select-none ${
                    arrangeLocked
                      ? 'cursor-pointer'
                      : isDraggingCat
                      ? 'opacity-45 scale-[0.98] cursor-grabbing'
                      : 'cursor-grab active:cursor-grabbing'
                  } ${
                    isDropTargetCat
                      ? 'ring-2 ring-[var(--ls-accent)] bg-[var(--ls-accent-soft)] text-[var(--ls-text)]'
                      : isActive
                      ? 'bg-[var(--ls-surface-muted)] text-[var(--ls-text)]'
                      : 'text-[var(--ls-text-secondary)] hover:bg-[var(--ls-surface-muted)] hover:text-[var(--ls-text)]'
                  }`}
                  style={{ borderRadius: 'var(--ls-radius-control)' }}
                >
                  <span className="flex items-center gap-2 truncate min-w-0">
                    {!arrangeLocked && (
                      <GripVertical className="w-3.5 h-3.5 text-[var(--ls-text-muted)] opacity-35 group-hover:opacity-90 shrink-0 transition-opacity" />
                    )}
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      draggable={false}
                      onClick={(e) => handleDeleteCategory(cat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/15 text-[var(--ls-text-muted)] hover:text-rose-500 transition-opacity cursor-pointer"
                      title="Delete category"
                      aria-label={`Delete category ${cat.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-[var(--ls-text-muted)] tabular-nums">
                      {categoryCounts.counts[cat.id] || 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer: Appearance + Backup Utilities */}
      <div className="p-3 border-t border-[var(--ls-border)] space-y-2.5 shrink-0 bg-[var(--ls-bg)]">
        {/* Theme Customizer Trigger */}
        <button
          type="button"
          onClick={() => {
            setIsAppearanceModalOpen(true);
            setMobileMenuOpen(false);
          }}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium bg-[var(--ls-surface)] border border-[var(--ls-border)] hover:border-[var(--ls-border-strong)] text-[var(--ls-text)] transition-colors cursor-pointer"
          style={{ borderRadius: 'var(--ls-radius-control)' }}
        >
          <span className="flex items-center gap-2 truncate">
            <Palette className="w-3.5 h-3.5 text-[var(--ls-accent-text)] shrink-0" />
            <span className="truncate">Theme: {activeThemeName}</span>
          </span>
          <span
            className="w-3 h-3 rounded-full shrink-0 border border-black/10"
            style={{ backgroundColor: 'var(--ls-accent)' }}
          />
        </button>

        {/* Export / Import */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-[var(--ls-surface)] border border-[var(--ls-border)] text-[var(--ls-text-secondary)] hover:text-[var(--ls-text)] hover:border-[var(--ls-border-strong)] transition-colors cursor-pointer"
            style={{ borderRadius: 'var(--ls-radius-control)' }}
            title="Export JSON backup"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-[var(--ls-surface)] border border-[var(--ls-border)] text-[var(--ls-text-secondary)] hover:text-[var(--ls-text)] hover:border-[var(--ls-border-strong)] transition-colors cursor-pointer"
            style={{ borderRadius: 'var(--ls-radius-control)' }}
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

        {/* Blank / Reset Demo & Quick Dark Mode */}
        <div className="flex items-center justify-between pt-0.5 gap-2">
          {!confirmReset ? (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-1 text-xs text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] transition-colors px-1 cursor-pointer"
                title="Restore sample demo bookmarks"
              >
                <RotateCcw className="w-3 h-3" />
                Demo
              </button>
              {(bookmarks.length > 0 || categories.length > 0) && (
                <button
                  type="button"
                  onClick={handleStartBlank}
                  className="text-xs text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] transition-colors cursor-pointer"
                  title="Clear all bookmarks and categories"
                >
                  Clear All
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-600 dark:text-amber-400 font-medium">Reset?</span>
              <button
                type="button"
                onClick={handleResetDemo}
                className="text-rose-600 dark:text-rose-400 font-semibold hover:underline cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-[var(--ls-text-muted)] hover:underline cursor-pointer"
              >
                No
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={toggleDarkModeQuick}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--ls-surface)] border border-[var(--ls-border)] text-xs font-medium text-[var(--ls-text-secondary)] hover:text-[var(--ls-text)] hover:border-[var(--ls-border-strong)] transition-colors cursor-pointer"
            style={{ borderRadius: 'var(--ls-radius-control)' }}
            title={isDarkActive ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDarkActive ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkActive ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[var(--ls-bg)] text-[var(--ls-text)] transition-colors duration-150">
      {/* Desktop Collapsible & Resizable Sidebar */}
      <aside
        className={`hidden lg:flex relative shrink-0 border-r border-[var(--ls-border)] bg-[var(--ls-surface)] ${
          isResizingSidebar ? '' : 'transition-[width] duration-200'
        } ${sidebarOpen ? '' : 'border-r-0 overflow-hidden'}`}
        style={{ width: sidebarOpen ? `${sidebarWidth}px` : '0px' }}
      >
        <div
          className="h-screen sticky top-0 overflow-hidden"
          style={{ width: `${sidebarWidth}px` }}
        >
          {renderSidebarContent()}
        </div>

        {/* Draggable Sidebar Divider Handle */}
        {sidebarOpen && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            title="Drag to resize sidebar (double-click to reset)"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingSidebar(true);
            }}
            onDoubleClick={() => setSidebarWidth(256)}
            className={`absolute top-0 right-0 bottom-0 w-1.5 translate-x-1/2 z-40 cursor-col-resize group flex items-center justify-center`}
          >
            <div
              className={`w-[2px] h-full transition-colors ${
                isResizingSidebar
                  ? 'bg-[var(--ls-accent)]'
                  : 'bg-transparent group-hover:bg-[var(--ls-accent)]'
              }`}
            />
          </div>
        )}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-[var(--ls-surface)] h-full shadow-2xl z-10 border-r border-[var(--ls-border)]">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 px-4 sm:px-6 bg-[var(--ls-surface)]/92 backdrop-blur-md border-b border-[var(--ls-border)] flex items-center justify-between gap-3">
          {/* Left: Sidebar Toggle & Search */}
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[var(--ls-text-muted)] hover:bg-[var(--ls-surface-muted)] cursor-pointer"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden lg:flex p-2 rounded-lg text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] hover:bg-[var(--ls-surface-muted)] transition-colors cursor-pointer"
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--ls-text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookmarks, URLs, or notes..."
                className="w-full pl-9 pr-16 py-2 text-sm bg-[var(--ls-surface-muted)] border border-transparent focus:border-[var(--ls-accent)] focus:bg-[var(--ls-surface)] text-[var(--ls-text)] placeholder:text-[var(--ls-text-muted)] focus:outline-none transition-all"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[var(--ls-text-muted)] bg-[var(--ls-surface)] border border-[var(--ls-border)] rounded">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              )}
            </div>
          </div>

          {/* Right: Arrange Lock, View Switcher & Add CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleArrangeLock}
              className={`inline-flex items-center justify-center p-2.5 border transition-colors shrink-0 cursor-pointer ${
                arrangeLocked
                  ? 'bg-[var(--ls-accent-soft)] border-[var(--ls-accent)] text-[var(--ls-accent-text)]'
                  : 'bg-[var(--ls-surface-muted)] border-[var(--ls-border)] text-[var(--ls-text-secondary)] hover:text-[var(--ls-text)] hover:border-[var(--ls-border-strong)]'
              }`}
              style={{ borderRadius: 'var(--ls-radius-control)' }}
              title={
                arrangeLocked
                  ? 'Arrange locked — click to unlock categories and boxes'
                  : 'Arrange unlocked — click to lock categories and boxes'
              }
              aria-label={arrangeLocked ? 'Unlock arrange' : 'Lock arrange'}
            >
              {arrangeLocked ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
            </button>

            <div
              className="hidden sm:flex items-center p-1 bg-[var(--ls-surface-muted)] border border-[var(--ls-border)]"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[var(--ls-surface)] text-[var(--ls-accent-text)] shadow-xs'
                    : 'text-[var(--ls-text-muted)] hover:text-[var(--ls-text)]'
                }`}
                style={{ borderRadius: 'calc(var(--ls-radius-control) - 3px)' }}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[var(--ls-surface)] text-[var(--ls-accent-text)] shadow-xs'
                    : 'text-[var(--ls-text-muted)] hover:text-[var(--ls-text)]'
                }`}
                style={{ borderRadius: 'calc(var(--ls-radius-control) - 3px)' }}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Bookmark Primary CTA */}
            <button
              type="button"
              onClick={() => openCreateModal('')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium bg-[var(--ls-accent)] hover:bg-[var(--ls-accent-hover)] text-[var(--ls-accent-fg)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Bookmark</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </header>

        {/* Subheader: Collection Title, Filter Status, Toolbar */}
        <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              {currentViewColor && (
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: currentViewColor }}
                />
              )}
              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--ls-text)]">
                {currentViewTitle}
              </h1>
              <span className="text-sm font-medium text-[var(--ls-text-muted)] tabular-nums">
                ({filteredBookmarks.length})
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--ls-text-muted)]">
              <span>
                {arrangeLocked
                  ? 'Arrange is locked · '
                  : 'Drag categories or boxes to arrange · '}
                Press{' '}
                <kbd className="px-1 py-0.5 rounded bg-[var(--ls-surface-muted)] border border-[var(--ls-border)] font-mono text-[10px]">
                  Ctrl+V
                </kbd>{' '}
                to quick-save a URL
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 self-start sm:self-auto">
            {filteredBookmarks.length > 0 && (
              <button
                type="button"
                onClick={toggleSelectAllVisible}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-[var(--ls-surface)] border border-[var(--ls-border)] text-[var(--ls-text-secondary)] hover:text-[var(--ls-text)] hover:border-[var(--ls-border-strong)] transition-colors whitespace-nowrap cursor-pointer"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                {selectedIds.length === filteredBookmarks.length &&
                filteredBookmarks.length > 0 ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[var(--ls-accent-text)]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[var(--ls-text-muted)]" />
                )}
                Select All
              </button>
            )}

            {/* Mobile View Switcher */}
            <div
              className="flex sm:hidden items-center p-0.5 bg-[var(--ls-surface-muted)] border border-[var(--ls-border)]"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[var(--ls-surface)] text-[var(--ls-accent-text)]'
                    : 'text-[var(--ls-text-muted)]'
                }`}
                style={{ borderRadius: 'calc(var(--ls-radius-control) - 3px)' }}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[var(--ls-surface)] text-[var(--ls-accent-text)]'
                    : 'text-[var(--ls-text-muted)]'
                }`}
                style={{ borderRadius: 'calc(var(--ls-radius-control) - 3px)' }}
                aria-label="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sort Select */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--ls-text-muted)] absolute left-2.5 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-8 pr-3 py-1.5 text-xs font-medium bg-[var(--ls-surface)] border border-[var(--ls-border)] text-[var(--ls-text-secondary)] hover:border-[var(--ls-border-strong)] focus:outline-none focus:border-[var(--ls-accent)] cursor-pointer"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
                aria-label="Sort bookmarks"
              >
                <option value="custom">Custom Order</option>
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
            <div
              className="mt-12 max-w-md mx-auto text-center p-8 bg-[var(--ls-surface)] border border-dashed border-[var(--ls-border-strong)]"
              style={{ borderRadius: 'var(--ls-radius-card)' }}
            >
              <div
                className="w-12 h-12 bg-[var(--ls-accent-soft)] text-[var(--ls-accent-text)] flex items-center justify-center mx-auto mb-4"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[var(--ls-text)]">
                No bookmarks found
              </h3>
              <p className="mt-1 text-sm text-[var(--ls-text-muted)]">
                {searchQuery
                  ? 'Try clearing your search query.'
                  : 'Add your first URL to this collection or paste a link directly.'}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-3.5 py-2 text-xs font-medium bg-[var(--ls-surface-muted)] text-[var(--ls-text-secondary)] hover:text-[var(--ls-text)] cursor-pointer"
                    style={{ borderRadius: 'var(--ls-radius-control)' }}
                  >
                    Clear Search
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openCreateModal('')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[var(--ls-accent)] hover:bg-[var(--ls-accent-hover)] text-[var(--ls-accent-fg)] cursor-pointer"
                  style={{ borderRadius: 'var(--ls-radius-control)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Bookmark
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
                appearance.densityPreset === 'compact' ? 'gap-3' : 'gap-4'
              }`}
            >
              {filteredBookmarks.map((bm) => (
                <BookmarkCard
                  key={bm.id}
                  bookmark={bm}
                  category={categories.find((c) => c.id === bm.categoryId)}
                  isSelected={selectedIds.includes(bm.id)}
                  isCopied={copiedId === bm.id}
                  density={appearance.densityPreset}
                  arrangeLocked={arrangeLocked}
                  isDragging={draggedId === bm.id}
                  isDragOver={dragOverId === bm.id}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onToggleSelect={toggleSelect}
                  onToggleFavorite={toggleFavorite}
                  onCopyUrl={copyUrl}
                  onEdit={openEditModal}
                  onDelete={deleteBookmark}
                  onSelectCategory={(catId) => setActiveView(catId)}
                />
              ))}
            </div>
          ) : (
            <div
              className="bg-[var(--ls-surface)] border border-[var(--ls-border)] divide-y divide-[var(--ls-border)] overflow-hidden"
              style={{ borderRadius: 'var(--ls-radius-card)' }}
            >
              {filteredBookmarks.map((bm) => (
                <BookmarkRow
                  key={bm.id}
                  bookmark={bm}
                  category={categories.find((c) => c.id === bm.categoryId)}
                  isSelected={selectedIds.includes(bm.id)}
                  isCopied={copiedId === bm.id}
                  density={appearance.densityPreset}
                  arrangeLocked={arrangeLocked}
                  isDragging={draggedId === bm.id}
                  isDragOver={dragOverId === bm.id}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onToggleSelect={toggleSelect}
                  onToggleFavorite={toggleFavorite}
                  onCopyUrl={copyUrl}
                  onEdit={openEditModal}
                  onDelete={deleteBookmark}
                  onSelectCategory={(catId) => setActiveView(catId)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FLOATING BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 bg-[var(--ls-surface)] text-[var(--ls-text)] shadow-xl border border-[var(--ls-border-strong)] flex items-center gap-3 flex-wrap justify-center"
          style={{ borderRadius: 'var(--ls-radius-card)' }}
        >
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--ls-accent)] text-[var(--ls-accent-fg)] tabular-nums">
            {selectedIds.length} selected
          </span>

          <div className="h-4 w-px bg-[var(--ls-border)]" />

          <div className="flex items-center gap-1.5">
            <FolderPlus className="w-4 h-4 text-[var(--ls-text-muted)]" />
            <select
              value={bulkCategoryTarget}
              onChange={(e) => handleBulkMoveCategory(e.target.value)}
              className="bg-[var(--ls-surface-muted)] text-xs text-[var(--ls-text)] border border-[var(--ls-border)] px-2.5 py-1.5 focus:outline-none focus:border-[var(--ls-accent)] cursor-pointer"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
              aria-label="Move selected bookmarks to category"
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
            type="button"
            onClick={handleBulkDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
            style={{ borderRadius: 'var(--ls-radius-control)' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>

          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="p-1 text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] cursor-pointer"
            title="Clear selection"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ADD / EDIT BOOKMARK MODAL */}
      <BookmarkModal
        isOpen={isBookmarkModalOpen}
        editingBookmark={editingBookmark}
        prefillUrl={prefillUrl}
        defaultCategoryId={defaultModalCategory}
        defaultFavorite={activeView === 'favorites'}
        categories={categories}
        onClose={() => setIsBookmarkModalOpen(false)}
        onSave={handleSaveBookmark}
        onCreateCategory={handleCreateCategoryInline}
        onNotify={(msg) => showToast(msg)}
      />

      {/* APPEARANCE & THEME CUSTOMIZER MODAL */}
      <AppearanceModal
        isOpen={isAppearanceModalOpen}
        onClose={() => setIsAppearanceModalOpen(false)}
        settings={appearance}
        onChange={setAppearance}
      />

      {/* DELETE BOOKMARK CONFIRMATION MODAL */}
      {pendingDeleteIds && pendingDeleteIds.length > 0 && (() => {
        const deleteSet = new Set(pendingDeleteIds);
        const targets = bookmarks.filter((bm) => deleteSet.has(bm.id));
        const affectedCategoryIds = Array.from(
          new Set(targets.map((bm) => bm.categoryId).filter(Boolean))
        );
        const remainingBookmarks = bookmarks.filter((bm) => !deleteSet.has(bm.id));
        const emptiedCategories = categories.filter(
          (cat) =>
            affectedCategoryIds.includes(cat.id) &&
            !remainingBookmarks.some((bm) => bm.categoryId === cat.id)
        );
        const isSingle = targets.length === 1;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <div
              className="fixed inset-0 bg-black/55 backdrop-blur-xs"
              onClick={() => setPendingDeleteIds(null)}
            />
            <div
              className="relative w-full max-w-md bg-[var(--ls-surface)] border border-[var(--ls-border)] shadow-2xl overflow-hidden z-10 p-6 space-y-4"
              style={{ borderRadius: 'var(--ls-radius-card)' }}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-500/12 text-rose-500 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    id="delete-confirm-title"
                    className="text-base font-semibold text-[var(--ls-text)]"
                  >
                    {isSingle
                      ? 'Delete Bookmark?'
                      : `Delete ${targets.length} Bookmarks?`}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--ls-text-secondary)] break-words">
                    {isSingle
                      ? `Are you sure you want to remove "${targets[0].title}"?`
                      : `Are you sure you want to permanently remove these ${targets.length} selected bookmarks?`}
                  </p>
                  {emptiedCategories.length > 0 && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-2" style={{ borderRadius: 'var(--ls-radius-control)' }}>
                      {emptiedCategories.length === 1
                        ? `Category "${emptiedCategories[0].name}" will have 0 bookmarks and will also be removed.`
                        : `Categories ${emptiedCategories.map((c) => `"${c.name}"`).join(', ')} will have 0 bookmarks and will also be removed.`}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPendingDeleteIds(null)}
                  className="px-4 py-2 text-sm font-medium text-[var(--ls-text-secondary)] hover:bg-[var(--ls-surface-muted)] transition-colors cursor-pointer"
                  style={{ borderRadius: 'var(--ls-radius-control)' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDeleteBookmarks}
                  className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                  style={{ borderRadius: 'var(--ls-radius-control)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-[var(--ls-text)] text-[var(--ls-bg)] text-xs font-medium shadow-lg flex items-center gap-2"
          style={{ borderRadius: 'var(--ls-radius-control)' }}
          role="status"
          aria-live="polite"
        >
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
