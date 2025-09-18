'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useMemo } from 'react';

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src: string | undefined;
  alt: string;
  fallbackSrc?: string;
};

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/images/burger-king-icon.png',
  ...rest
}: Props) {
  const initialSrc = useMemo(() => {
    if (!src || typeof src !== 'string' || src.trim() === '')
      return fallbackSrc;
    return src;
  }, [src, fallbackSrc]);

  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const handleError = () => {
    if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
  };

  const isRemote = /^https?:\/\//i.test(currentSrc);
  return (
    <Image
      src={currentSrc}
      alt={alt}
      onError={handleError}
      // Bypass Next optimizer for remote URLs to avoid upstream fetch errors
      unoptimized={isRemote}
      {...rest}
    />
  );
}
