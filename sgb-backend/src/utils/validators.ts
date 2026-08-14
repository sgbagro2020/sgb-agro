export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export function validateProductData(data: Record<string, unknown>): string | null {
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    return 'Product title is required.';
  }
  if (data.price === undefined || data.price === null || !String(data.price).trim()) {
    return 'Product price is required.';
  }
  if (!data.category || typeof data.category !== 'string') {
    return 'Product category is required.';
  }
  if (!data.image || typeof data.image !== 'string') {
    return 'Main product image URL is required.';
  }
  return null;
}

export function validateGalleryMediaData(data: Record<string, unknown>): string | null {
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    return 'Media title is required.';
  }
  if (!data.url || typeof data.url !== 'string') {
    return 'Media URL is required.';
  }
  if (!data.type || (data.type !== 'image' && data.type !== 'video')) {
    return 'Media type must be either "image" or "video".';
  }
  return null;
}

export function validateBlogPostData(data: Record<string, unknown>): string | null {
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    return 'Blog post title is required.';
  }
  if (!data.content || typeof data.content !== 'string') {
    return 'Blog post content is required.';
  }
  return null;
}
