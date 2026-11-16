import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { getDomain, getFaviconUrl } from '../data/defaults';

interface FaviconImageProps {
  url: string;
  sizeClass?: string;
  fallbackClass?: string;
}

export const FaviconImage: React.FC<FaviconImageProps> = ({
  url,
  sizeClass = 'w-6 h-6',
  fallbackClass = 'w-4 h-4',
}) => {
  const [failed, setFailed] = useState(false);
  const src = getFaviconUrl(url);
  const domain = getDomain(url);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !url.trim()) {
    return (
      <Globe
        className={`${fallbackClass} text-[var(--ls-text-muted)]`}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={src}
      alt={`${domain} icon`}
      referrerPolicy="no-referrer"
      className={`${sizeClass} object-contain`}
      onError={() => setFailed(true)}
    />
  );
};
