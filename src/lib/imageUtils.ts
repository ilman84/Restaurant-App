/**
 * Utility functions for handling restaurant images
 */

export interface ImageSource {
  images?: string[];
  logo?: string;
}

/**
 * Get the best available image from restaurant data
 * @param source - Restaurant data containing images and logo
 * @param fallback - Fallback image path (default: burger-king-icon.png)
 * @returns Processed image URL or fallback
 */
export function getRestaurantImage(
  source: ImageSource,
  fallback: string = '/images/burger-king-icon.png'
): string {
  const raw =
    source.images && source.images.length > 0 && source.images[0]
      ? source.images[0]
      : source.logo || '';

  if (!raw || raw === '' || typeof raw !== 'string') {
    return fallback;
  }

  if (raw.startsWith('<svg')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(raw)}`;
  }

  // Validate URL format
  try {
    new URL(raw);
    return raw;
  } catch {
    return fallback;
  }
}

/**
 * Get menu item image with fallback
 * @param imageUrl - Menu item image URL
 * @param fallback - Fallback image path
 * @returns Processed image URL or fallback
 */
export function getMenuItemImage(
  imageUrl: string | undefined,
  fallback: string = '/images/burger-king-icon.png'
): string {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl === '') {
    return fallback;
  }

  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    return fallback;
  }
}

/**
 * Choose best image for a restaurant card, preferring a sample menu image
 * when available so the photo matches the restaurant's food.
 */
export function getRestaurantCardImage(
  source: {
    sampleMenus?: Array<{ image?: string }>;
    images?: string[];
    logo?: string;
  },
  fallback: string = '/images/burger-king-icon.png'
): string {
  const candidate =
    source.sampleMenus?.find((m) => !!m.image)?.image ||
    (source.images && source.images.length > 0 ? source.images[0] : '') ||
    source.logo ||
    '';

  if (!candidate || typeof candidate !== 'string') return fallback;
  if (candidate.startsWith('<svg')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(candidate)}`;
  }
  try {
    new URL(candidate);
    return candidate;
  } catch {
    return fallback;
  }
}

/**
 * Check if an image URL is valid
 * @param url - Image URL to validate
 * @returns True if URL is valid
 */
export function isValidImageUrl(url: string | undefined): boolean {
  if (!url || typeof url !== 'string' || url === '') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
