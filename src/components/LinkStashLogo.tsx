import React, { useEffect, useState } from 'react';

interface LinkStashLogoProps {
  className?: string;
  colorOverride?: string;
}

const LOGO_ASSET_PATH = '/assets/aistudio/image_bceafb4b.png';

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

function recolorAttachedLogo(img: HTMLImageElement, targetColor: string): string | null {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return null;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // 1. Flood-fill from outer border pixels to remove the light gray background
  //    and soft outer drop shadow while preserving the white folder inside.
  const visited = new Uint8Array(w * h);
  const isOuterNeutral = (idx: number) => {
    const p = idx * 4;
    const a = data[p + 3];
    if (a < 30) return true;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    // Neutral light-to-mid gray backdrop/shadow around the green squircle
    return min > 165 && max - min < 26;
  };

  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const tryPush = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const idx = y * w + x;
    if (visited[idx]) return;
    if (isOuterNeutral(idx)) {
      visited[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < w; x++) {
    tryPush(x, 0);
    tryPush(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    tryPush(0, y);
    tryPush(w - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    data[idx * 4 + 3] = 0;
    const x = idx % w;
    const y = (idx - x) / w;
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }

  // Smooth the outer squircle border pixels adjacent to transparent background
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const p = idx * 4;
      if (data[p + 3] === 0) continue;
      const touchesBg =
        visited[idx - 1] || visited[idx + 1] || visited[idx - w] || visited[idx + w];
      if (touchesBg) {
        const min = Math.min(data[p], data[p + 1], data[p + 2]);
        const max = Math.max(data[p], data[p + 1], data[p + 2]);
        if (max - min < 32 && min > 120) {
          data[p + 3] = Math.max(0, Math.round(((175 - min) / 55) * 255));
        }
      }
    }
  }

  // 2. Recolor the squircle & inner bookmark cutout pixels based on targetColor
  const targetRgb = targetColor !== 'original' ? parseHex(targetColor) : null;
  if (targetRgb) {
    for (let i = 0; i < w * h; i++) {
      const p = i * 4;
      const a = data[p + 3];
      if (a === 0) continue;

      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max - min;

      // Preserve the crisp white folder silhouette inside the squircle
      if (min > 205 && sat < 28) {
        continue;
      }

      // Preserve original shading depth (lighter top-left, deeper bottom-right)
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const shade = Math.min(1.25, Math.max(0.32, (lum + 0.08) * 2.1));

      // Smoothly blend anti-aliased edge pixels between the colored squircle and white folder
      if (min > 95 && sat < 70) {
        const whiteMix = Math.min(1, (min - 95) / 115);
        const tintedR = Math.min(255, targetRgb.r * shade);
        const tintedG = Math.min(255, targetRgb.g * shade);
        const tintedB = Math.min(255, targetRgb.b * shade);
        data[p] = Math.round(tintedR * (1 - whiteMix) + 255 * whiteMix);
        data[p + 1] = Math.round(tintedG * (1 - whiteMix) + 255 * whiteMix);
        data[p + 2] = Math.round(tintedB * (1 - whiteMix) + 255 * whiteMix);
      } else {
        data[p] = Math.min(255, Math.round(targetRgb.r * shade));
        data[p + 1] = Math.min(255, Math.round(targetRgb.g * shade));
        data[p + 2] = Math.min(255, Math.round(targetRgb.b * shade));
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // 3. Crop transparent outer margins into a tight square so the icon fills its size box
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX > minX && maxY > minY) {
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    const side = Math.max(bw, bh) + 2;
    const trimmed = document.createElement('canvas');
    trimmed.width = side;
    trimmed.height = side;
    const tCtx = trimmed.getContext('2d');
    if (tCtx) {
      const dx = Math.floor((side - bw) / 2);
      const dy = Math.floor((side - bh) / 2);
      tCtx.drawImage(canvas, minX, minY, bw, bh, dx, dy, bw, bh);
      return trimmed.toDataURL('image/png');
    }
  }

  return canvas.toDataURL('image/png');
}

export const LinkStashLogo: React.FC<LinkStashLogoProps> = ({
  className = 'w-10 h-10',
  colorOverride,
}) => {
  const [resolvedColor, setResolvedColor] = useState<string>(() => {
    if (colorOverride) return colorOverride;
    if (typeof document !== 'undefined') {
      return document.documentElement.dataset.lsLogoColor || 'accent';
    }
    return 'accent';
  });

  const [processedSrc, setProcessedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (colorOverride) {
      setResolvedColor(colorOverride);
      return;
    }
    const syncColor = () => {
      const current = document.documentElement.dataset.lsLogoColor || 'accent';
      setResolvedColor(current);
    };
    syncColor();
    window.addEventListener('ls-appearance-change', syncColor);
    return () => window.removeEventListener('ls-appearance-change', syncColor);
  }, [colorOverride]);

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.onload = () => {
      if (!active) return;
      try {
        const result = recolorAttachedLogo(img, resolvedColor);
        if (result) {
          setProcessedSrc(result);
        }
      } catch {
        setProcessedSrc(null);
      }
    };
    img.src = LOGO_ASSET_PATH;
    return () => {
      active = false;
    };
  }, [resolvedColor]);

  return (
    <img
      src={processedSrc || LOGO_ASSET_PATH}
      alt="LinkStash Logo"
      className={`${className} object-contain select-none`}
      draggable={false}
    />
  );
};
