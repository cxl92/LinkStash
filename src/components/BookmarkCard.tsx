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

interface BookmarkCardProps {
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

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
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
    <article
      draggable={!arrangeLocked}
      onDragStart={(e) => !arrangeLocked && onDragStart(bookmark.id, e)}
      onDragOver={(e) => !arrangeLocked && onDragOver(bookmark.id, e)}
      onDrop={(e) => !arrangeLocked && onDrop(bookmark.id, e)}
      onDragEnd={onDragEnd}
      className={`group relative flex flex-col bg-[var(--ls-surface)] border transition-all duration-150 overflow-hidden ${
        !arrangeLocked ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDragging ? 'opacity-45 scale-[0.98]' : ''} ${
        isDragOver && !isDragging
          ? 'border-[var(--ls-accent)] ring-2 ring-[var(--ls-accent)]'
          : isSelected
          ? 'border-[var(--ls-accent)] ring-2 ring-[var(--ls-accent-soft)]'
          : 'border-[var(--ls-border)] hover:border-[var(--ls-border-strong)]'
      }`}
      style={{ borderRadius: 'var(--ls-radius-card)' }}
    >
      {/* Top Header Strip */}
      <div
        className={`relative px-4 flex items-center justify-between border-b border-[var(--ls-border)] ${
          compact ? 'h-16 pt-1' : 'h-22 pt-2'
        }`}
        style={{
          background: category
            ? `linear-gradient(135deg, ${category.color}16 0%, ${category.color}05 100%)`
            : 'linear-gradient(135deg, rgba(100,116,139,0.09) 0%, rgba(100,116,139,0.02) 100%)',
        }}
      >
        <div className="flex items-center gap-1">
          {!arrangeLocked && (
            <span
              className="p-1 text-[var(--ls-text-muted)] opacity-60 group-hover:opacity-100 transition-opacity"
              title="Drag to rearrange"
              aria-hidden="true"
            >
              <GripVertical className="w-4 h-4" />
            </span>
          )}
          <button
            type="button"
            onClick={() => onToggleSelect(bookmark.id)}
            className={`p-1.5 rounded-lg transition-opacity cursor-pointer ${
              isSelected
                ? 'opacity-100 text-[var(--ls-accent-text)] bg-[var(--ls-surface)]'
                : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] bg-[var(--ls-surface)]/90'
            }`}
            aria-label={isSelected ? `Deselect ${bookmark.title}` : `Select ${bookmark.title}`}
          >
            {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          </button>
        </div>

        {hasUrl ? (
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${
              compact ? 'w-10 h-10' : 'w-12 h-12'
            } bg-[var(--ls-surface)] border border-[var(--ls-border)] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform`}
            style={{ borderRadius: 'var(--ls-radius-control)' }}
            aria-label={`Open ${bookmark.title}`}
          >
            <FaviconImage
              url={bookmark.url}
              sizeClass={compact ? 'w-5 h-5' : 'w-6 h-6'}
              fallbackClass={compact ? 'w-4 h-4' : 'w-5 h-5'}
            />
          </a>
        ) : (
          <div
            className={`${
              compact ? 'w-10 h-10' : 'w-12 h-12'
            } bg-[var(--ls-surface)] border border-[var(--ls-border)] flex items-center justify-center overflow-hidden`}
            style={{ borderRadius: 'var(--ls-radius-control)' }}
          >
            <FaviconImage
              url=""
              sizeClass={compact ? 'w-5 h-5' : 'w-6 h-6'}
              fallbackClass={compact ? 'w-4 h-4' : 'w-5 h-5'}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => onToggleFavorite(bookmark.id)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            bookmark.favorite
              ? 'text-amber-500 bg-amber-500/12'
              : 'text-[var(--ls-text-muted)] hover:text-amber-500 bg-[var(--ls-surface)]/80 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
          }`}
          aria-label={bookmark.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-4 h-4 ${bookmark.favorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className={`flex-1 flex flex-col justify-between ${compact ? 'p-3.5' : 'p-4'}`}>
        <div>
          {/* Unboxed Metadata Line */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-[var(--ls-text-muted)]">
            <span className="truncate">{domain}</span>
            <span className="shrink-0 tabular-nums">{formatRelativeDate(bookmark.createdAt)}</span>
          </div>

          {/* Title */}
          {hasUrl ? (
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-semibold text-sm text-[var(--ls-text)] hover:text-[var(--ls-accent-text)] line-clamp-2 leading-snug transition-colors"
            >
              {bookmark.title}
            </a>
          ) : (
            <div className="font-semibold text-sm text-[var(--ls-text)] line-clamp-2 leading-snug">
              {bookmark.title}
            </div>
          )}

          {/* Description */}
          {bookmark.description && (
            <p
              className={`mt-1.5 text-xs text-[var(--ls-text-muted)] leading-relaxed ${
                compact ? 'line-clamp-1' : 'line-clamp-2'
              }`}
            >
              {bookmark.description}
            </p>
          )}
        </div>

        {/* Footer: Category Filter + Action Buttons */}
        <div className="mt-3.5 pt-3 border-t border-[var(--ls-border)] flex items-center justify-between gap-2">
          <div className="min-w-0">
            {category ? (
              <button
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className="text-xs font-medium hover:underline truncate cursor-pointer whitespace-nowrap"
                style={{ color: category.color }}
              >
                {category.name}
              </button>
            ) : (
              <span className="text-xs text-[var(--ls-text-muted)]">Uncategorized</span>
            )}
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {hasUrl && (
              <button
                type="button"
                onClick={() => onCopyUrl(bookmark.id, bookmark.url)}
                className="p-1.5 rounded-md text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] hover:bg-[var(--ls-surface-muted)] transition-colors cursor-pointer"
                title="Copy URL"
                aria-label="Copy URL"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => onEdit(bookmark)}
              className="p-1.5 rounded-md text-[var(--ls-text-muted)] hover:text-[var(--ls-text)] hover:bg-[var(--ls-surface-muted)] transition-colors cursor-pointer"
              title="Edit"
              aria-label="Edit bookmark"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(bookmark.id)}
              className="p-1.5 rounded-md text-[var(--ls-text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Delete"
              aria-label="Delete bookmark"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            {hasUrl && (
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-[var(--ls-text-muted)] hover:text-[var(--ls-accent-text)] hover:bg-[var(--ls-accent-soft)] transition-colors"
                title="Open Link"
                aria-label={`Open ${bookmark.title} in new tab`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
