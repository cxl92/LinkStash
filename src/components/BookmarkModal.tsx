import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Star, X } from 'lucide-react';
import { BookmarkItem, Category } from '../types';
import { CATEGORY_COLORS, generateTitleFromUrl, getDomain } from '../data/defaults';
import { LinkStashLogo } from './LinkStashLogo';
import { FaviconImage } from './FaviconImage';

interface BookmarkModalProps {
  isOpen: boolean;
  editingBookmark: BookmarkItem | null;
  prefillUrl: string;
  defaultCategoryId: string;
  defaultFavorite: boolean;
  categories: Category[];
  onClose: () => void;
  onSave: (data: {
    url: string;
    title: string;
    description: string;
    categoryId: string;
    favorite: boolean;
  }) => void;
  onCreateCategory: (name: string, color: string) => Category;
  onNotify: (message: string) => void;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  editingBookmark,
  prefillUrl,
  defaultCategoryId,
  defaultFavorite,
  categories,
  onClose,
  onSave,
  onCreateCategory,
  onNotify,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[0]);

  useEffect(() => {
    if (!isOpen) return;
    setIsAddingCategory(false);
    setNewCategoryName('');
    setNewCategoryColor(CATEGORY_COLORS[0]);
    if (editingBookmark) {
      setUrl(editingBookmark.url);
      setTitle(editingBookmark.title);
      setDescription(editingBookmark.description || '');
      setCategoryId(editingBookmark.categoryId || '');
      setFavorite(Boolean(editingBookmark.favorite));
    } else {
      setUrl(prefillUrl);
      setTitle(prefillUrl ? generateTitleFromUrl(prefillUrl) : '');
      setDescription('');
      setCategoryId(defaultCategoryId);
      setFavorite(defaultFavorite);
    }
  }, [isOpen, editingBookmark, prefillUrl, defaultCategoryId, defaultFavorite]);

  if (!isOpen) return null;

  const handleAddCategoryInline = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      onNotify('Enter a category name');
      return;
    }
    const created = onCreateCategory(trimmed, newCategoryColor);
    setCategoryId(created.id);
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleSmartAutoFill = () => {
    if (!url.trim()) {
      onNotify('Enter a URL first to auto-fill metadata');
      return;
    }
    setAutoFilling(true);
    setTimeout(() => {
      const normalized =
        url.startsWith('http://') || url.startsWith('https://')
          ? url.trim()
          : `https://${url.trim()}`;
      setUrl(normalized);
      if (!title.trim()) {
        setTitle(generateTitleFromUrl(normalized));
      }
      const domain = getDomain(normalized);
      if (!description.trim()) {
        setDescription(`Saved resource from ${domain}. Quick reference bookmark.`);
      }
      setAutoFilling(false);
      onNotify('Auto-filled title & favicon metadata');
    }, 280);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawUrl = url.trim();
    const normalizedUrl = !rawUrl
      ? ''
      : rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? rawUrl
      : `https://${rawUrl}`;
    const finalTitle =
      title.trim() || (normalizedUrl ? generateTitleFromUrl(normalizedUrl) : 'Untitled Bookmark');

    onSave({
      url: normalizedUrl,
      title: finalTitle,
      description: description.trim(),
      categoryId,
      favorite,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookmark-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-xs"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg bg-[var(--ls-surface)] border border-[var(--ls-border)] shadow-2xl overflow-hidden z-10"
        style={{ borderRadius: 'var(--ls-radius-card)' }}
      >
        <div className="px-6 py-4 border-b border-[var(--ls-border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LinkStashLogo className="w-8 h-8 shrink-0" />
            <h2 id="bookmark-modal-title" className="text-base font-semibold text-[var(--ls-text)]">
              {editingBookmark ? 'Edit Bookmark' : 'Save New Bookmark'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] hover:bg-[var(--ls-surface-muted)] transition-colors"
            style={{ borderRadius: 'var(--ls-radius-control)' }}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* URL + Auto-Fill */}
          <div>
            <label className="block text-xs font-semibold text-[var(--ls-text-secondary)] mb-1.5">
              Website URL <span className="font-normal text-[var(--ls-text-muted)]">(optional)</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--ls-surface-muted)] border border-[var(--ls-border)] text-[var(--ls-text)] placeholder:text-[var(--ls-text-muted)] focus:outline-none focus:border-[var(--ls-accent)]"
                  style={{ borderRadius: 'var(--ls-radius-control)' }}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <FaviconImage url={url} sizeClass="w-4 h-4 rounded-xs" fallbackClass="w-4 h-4" />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSmartAutoFill}
                disabled={autoFilling}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[var(--ls-accent-soft)] text-[var(--ls-accent-text)] border border-[var(--ls-border)] hover:border-[var(--ls-accent)] transition-colors shrink-0 whitespace-nowrap cursor-pointer"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                <Sparkles className={`w-3.5 h-3.5 ${autoFilling ? 'animate-spin' : ''}`} />
                {autoFilling ? 'Fetching...' : 'Auto-Fill'}
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[var(--ls-text-secondary)] mb-1.5">
              Title
            </label>
            <input
              type="text"
              placeholder="Page title (auto-generated if left blank)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--ls-surface-muted)] border border-[var(--ls-border)] text-[var(--ls-text)] placeholder:text-[var(--ls-text-muted)] focus:outline-none focus:border-[var(--ls-accent)]"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            />
          </div>

          {/* Category & Favorite */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[var(--ls-text-secondary)]">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory((v) => !v)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ls-accent-text)] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    {isAddingCategory ? 'Close' : 'New Category'}
                  </button>
                </div>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[var(--ls-surface-muted)] border border-[var(--ls-border)] text-[var(--ls-text)] focus:outline-none focus:border-[var(--ls-accent)]"
                  style={{ borderRadius: 'var(--ls-radius-control)' }}
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
                <label className="block text-xs font-semibold text-[var(--ls-text-secondary)] mb-1.5">
                  Pin Status
                </label>
                <button
                  type="button"
                  onClick={() => setFavorite((v) => !v)}
                  className={`w-full py-2 px-3 text-sm font-medium border flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                    favorite
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-300'
                      : 'bg-[var(--ls-surface-muted)] border-[var(--ls-border)] text-[var(--ls-text-muted)] hover:text-[var(--ls-text)]'
                  }`}
                  style={{ borderRadius: 'var(--ls-radius-control)' }}
                >
                  <Star className={`w-4 h-4 ${favorite ? 'fill-current text-amber-500' : ''}`} />
                  {favorite ? 'Favorited' : 'Favorite'}
                </button>
              </div>
            </div>

            {isAddingCategory && (
              <div
                className="p-3 bg-[var(--ls-surface-muted)] border border-[var(--ls-border)] space-y-2.5"
                style={{ borderRadius: 'var(--ls-radius-control)' }}
              >
                <input
                  type="text"
                  placeholder="New category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategoryInline();
                    }
                  }}
                  autoFocus
                  className="w-full px-3 py-1.5 text-sm bg-[var(--ls-surface)] border border-[var(--ls-border)] text-[var(--ls-text)] placeholder:text-[var(--ls-text-muted)] focus:outline-none focus:border-[var(--ls-accent)]"
                  style={{ borderRadius: 'calc(var(--ls-radius-control) - 2px)' }}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {CATEGORY_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-4 h-4 rounded-full transition-transform cursor-pointer shrink-0 ${
                          newCategoryColor === color
                            ? 'scale-120 ring-2 ring-offset-1 ring-[var(--ls-text)] ring-offset-[var(--ls-surface-muted)]'
                            : 'opacity-75 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCategoryInline}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-[var(--ls-accent)] text-[var(--ls-accent-fg)] hover:bg-[var(--ls-accent-hover)] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[var(--ls-text-secondary)] mb-1.5">
              Notes <span className="font-normal text-[var(--ls-text-muted)]">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Why are you saving this link?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[var(--ls-surface-muted)] border border-[var(--ls-border)] text-[var(--ls-text)] placeholder:text-[var(--ls-text-muted)] focus:outline-none focus:border-[var(--ls-accent)] resize-none"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[var(--ls-text-secondary)] hover:bg-[var(--ls-surface-muted)] transition-colors cursor-pointer"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-[var(--ls-accent)] hover:bg-[var(--ls-accent-hover)] text-[var(--ls-accent-fg)] transition-colors cursor-pointer"
              style={{ borderRadius: 'var(--ls-radius-control)' }}
            >
              {editingBookmark ? 'Save Changes' : 'Save Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
