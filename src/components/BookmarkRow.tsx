import React from 'react';
import {
  Check,
  CheckSquare,
  Copy,
  Edit3,
  ExternalLink,
  GripVertical,
  Square,
  Star,
  Trash2,
} from 'lucide-react';
import { BookmarkItem, Category, DensityPreset } from '../types';
import { formatRelativeDate, getDomain } from '../data/defaults';
import { FaviconImage } from './FaviconImage';

interface BookmarkRowProps {
  bookmark: BookmarkItem;
  category?: Category;
  isSelected: boolean;
  isCopied: boolean;
  density: DensityPreset;
  arrangeLocked: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (id: string, e: React.DragEvent) => void;
  onDragOver: (id: string, e: React.DragEvent) => void;
  onDrop: (id: string, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCopyUrl: (id: string, url: string) => void;
  onEdit: (bookmark: BookmarkItem) => void;
  onDelete: (id: string) => void;
  onSelectCategory: (catId: string) => void;
}

export const BookmarkRow: React.FC<BookmarkRowProps> = ({
  bookmark,
  category,
  isSelected,
  isCopied,
  density,
  arrangeLocked,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggleSelect,
  onToggleFavorite,
  onCopyUrl,
  onEdit,
  onDelete,
  onSelectCategory,
}) => {
  const hasUrl = Boolean(bookmark.url.trim());
  const domain = getDomain(bookmark.url);
  const compact = density === 'compact';

  return (
    <div
      draggable={!arrangeLocked}
      onDragStart={(e) => !arrangeLocked && onDragStart(bookmark.id, e)}
      onDragOver={(e) => !arrangeLocked && onDragOver(bookmark.id, e)}
      onDrop={(e) => !arrangeLocked && onDrop(bookmark.id, e)}
      onDragEnd={onDragEnd}
      className={`group px-4 flex items-center justify-between gap-3 transition-all ${
        compact ? 'py-2.5' : 'py-3.5'
      } ${!arrangeLocked ? 'cursor-grab active:cursor-grabbing' : ''} ${
        isDragging ? 'opacity-45' : ''
      } ${
        isDragOver && !isDragging
          ? 'bg-[var(--ls-accent-soft)] ring-2 ring-inset ring-[var(--ls-accent)]'
          : isSelected
          ? 'bg-[var(--ls-accent-soft)]'
          : 'hover:bg-[var(--ls-surface-hover)]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {!arrangeLocked && (
          <span
            className="text-[var(--ls-text-muted)] opacity-50 group-hover:opacity-100 shrink-0"
            title="Drag to rearrange"
            aria-hidden="true"
          >
            <GripVertical className="w-4 h-4" />
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggleSelect(bookmark.id)}
          className={`shrink-0 cursor-pointer ${
            isSelected
              ? 'text-[var(--ls-accent-text)]'
              : 'text-[var(--ls-text-muted)] opacity-50 group-hover:opacity-100'
          }`}
          aria-label={isSelected ? `Deselect ${bookmark.title}` : `Select ${bookmark.title}`}
        >
          {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
        </button>

        <div
          className="w-8 h-8 bg-[var(--ls-surface-muted)] border border-[var(--ls-border)] flex items-center justify-center shrink-0"
          style={{ borderRadius: 'var(--ls-radius-control)' }}
        >
          <FaviconImage url={bookmark.url} sizeClass="w-4 h-4" fallbackClass="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            {hasUrl ? (
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm text-[var(--ls-text)] hover:text-[var(--ls-accent-text)] truncate transition-colors"
              >
                {bookmark.title}
              </a>
            ) : (
              <span className="font-medium text-sm text-[var(--ls-text)] truncate">
                {bookmark.title}
              </span>
            )}
            <span className="hidden md:inline text-xs text-[var(--ls-text-muted)] shrink-0">
              {domain}
            </span>
          </div>
          {bookmark.description && !compact && (
            <p className="text-xs text-[var(--ls-text-muted)] truncate mt-0.5">
              {bookmark.description}
            </p>
          )}
        </div>
      </div>

      {/* Metadata Column */}
      <div className="hidden lg:flex items-center gap-3 shrink-0 text-xs">
        {category && (
          <button
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className="font-medium hover:underline cursor-pointer whitespace-nowrap"
            style={{ color: category.color }}
          >
            {category.name}
          </button>
        )}

        <span className="text-[var(--ls-text-muted)] w-16 text-right tabular-nums">
          {formatRelativeDate(bookmark.createdAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onToggleFavorite(bookmark.id)}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            bookmark.favorite
              ? 'text-amber-500'
              : 'text-[var(--ls-text-muted)] hover:text-amber-500 opacity-60 group-hover:opacity-100'
          }`}
          title={bookmark.favorite ? 'Remove favorite' : 'Favorite'}
          aria-label="Toggle favorite"
        >
          <Star className={`w-4 h-4 ${bookmark.favorite ? 'fill-current' : ''}`} />
        </button>
        {hasUrl && (
          <button
            type="button"
            onClick={() => onCopyUrl(bookmark.id, bookmark.url)}
            className="p-1.5 rounded-md text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] hover:bg-[var(--ls-surface-muted)] cursor-pointer"
            title="Copy URL"
            aria-label="Copy URL"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => onEdit(bookmark)}
          className="p-1.5 rounded-md text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] hover:bg-[var(--ls-surface-muted)] cursor-pointer"
          title="Edit"
          aria-label="Edit bookmark"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(bookmark.id)}
          className="p-1.5 rounded-md text-[var(--ls-text-muted)] hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
          title="Delete"
          aria-label="Delete bookmark"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {hasUrl && (
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-[var(--ls-text-muted)] hover:text-[var(--ls-accent-text)] hover:bg-[var(--ls-accent-soft)]"
            title="Open Link"
            aria-label={`Open ${bookmark.title} in new tab`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
