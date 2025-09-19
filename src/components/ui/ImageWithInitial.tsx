'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useMemo } from 'react';

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src: string | undefined;
  alt: string;
  fallbackText?: string;
  className?: string;
};

export default function ImageWithInitial({
  src,
  alt,
  fallbackText,
  className = '',
  ...rest
}: Props) {
  const [hasError, setHasError] = useState(false);

  const initialSrc = useMemo(() => {
    if (!src || typeof src !== 'string' || src.trim() === '') {
      return null;
    }
    return src;
  }, [src]);

  const handleError = () => {
    setHasError(true);
  };

  const isRemote = useMemo(() => {
    if (!initialSrc) return false;
    try {
      const url = new URL(initialSrc);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, [initialSrc]);

  // Generate initial from alt text or fallback text (2 characters)
  const getInitial = () => {
    const text = fallbackText || alt || 'R';
    const cleanText = text.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (cleanText.length === 0) return 'R';
    if (cleanText.length === 1) return cleanText.charAt(0).toUpperCase();

    // Get first 2 characters, prioritizing first letter of each word
    const words = cleanText.split(/\s+/);
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return cleanText.substring(0, 2).toUpperCase();
  };

  // Generate consistent color based on text
  const getBackgroundColor = () => {
    const text = fallbackText || alt || 'R';
    const cleanText = text
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim()
      .toLowerCase();

    // Color palette for different backgrounds
    const colors = [
      '#c12116', // Red
      '#2563eb', // Blue
      '#059669', // Green
      '#dc2626', // Red-600
      '#7c3aed', // Purple
      '#ea580c', // Orange
      '#0891b2', // Cyan
      '#be185d', // Pink
      '#65a30d', // Lime
      '#ca8a04', // Yellow
      '#dc2626', // Red-600
      '#1d4ed8', // Blue-700
      '#16a34a', // Green-600
      '#9333ea', // Purple-600
      '#ea580c', // Orange-600
    ];

    // Generate hash from text for consistent color
    let hash = 0;
    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // If no src or error occurred, show initial
  if (!initialSrc || hasError) {
    return (
      <div
        className={`flex items-center justify-center text-white font-bold w-full h-full ${className}`}
        style={{
          backgroundColor: getBackgroundColor(),
          fontSize: 'clamp(14px, 3vw, 24px)',
          lineHeight: '1',
          letterSpacing: '0.05em',
          fontWeight: '800',
        }}
      >
        <span className='text-center leading-none'>{getInitial()}</span>
      </div>
    );
  }

  return (
    <Image
      src={initialSrc}
      alt={alt}
      onError={handleError}
      unoptimized={isRemote}
      className={className}
      {...rest}
    />
  );
}
