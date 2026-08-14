export interface BlogItem {
  id: string;
  title: string;
  shortDescription: string;
  content: string; // Full HTML content
  featuredImage?: string; // Base64 or URL
  uploadDate: string;
  published: boolean;
  order: number;
  slug?: string;
}

const DB_NAME = 'SGB_AGRO_BLOG_DB';
const STORE_NAME = 'blog_articles';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject('IndexedDB is not supported');
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('order', 'order', { unique: false });
        store.createIndex('uploadDate', 'uploadDate', { unique: false });
      }
    };
  });
}

export async function getAllBlogs(): Promise<BlogItem[]> {
  try {
    const db = await openDB();
    const items: BlogItem[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    items.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    });

    return items;
  } catch (err) {
    console.warn('Failed to load blogs from IndexedDB, falling back to localStorage:', err);
    try {
      const local = localStorage.getItem('sgb_blog_items');
      if (local) {
        const parsed = JSON.parse(local);
        parsed.sort((a: BlogItem, b: BlogItem) => (a.order || 0) - (b.order || 0));
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  }
}

export async function saveBlog(item: BlogItem): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB save blog failed, falling back to localStorage:', err);
    try {
      const current = await getAllBlogs();
      const existingIdx = current.findIndex((i) => i.id === item.id);
      if (existingIdx >= 0) {
        current[existingIdx] = item;
      } else {
        current.unshift(item);
      }
      localStorage.setItem('sgb_blog_items', JSON.stringify(current));
    } catch (e) {
      console.error('LocalStorage save blog failed:', e);
    }
  }
}

export async function deleteBlog(id: string): Promise<void> {
  // Always clean up localStorage first if present
  try {
    const local = localStorage.getItem('sgb_blog_items');
    if (local) {
      const current = JSON.parse(local);
      const filtered = current.filter((i: any) => i.id !== id);
      localStorage.setItem('sgb_blog_items', JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('LocalStorage delete blog sync failed:', e);
  }

  // Then delete from IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB delete blog failed:', err);
    throw err;
  }
}

export async function saveAllBlogs(items: BlogItem[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (let i = 0; i < items.length; i++) {
      const itemWithOrder = { ...items[i], order: i };
      store.put(itemWithOrder);
    }
    await new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
    });
  } catch (err) {
    console.warn('IndexedDB saveAllBlogs failed, fallback to localStorage:', err);
    try {
      localStorage.setItem('sgb_blog_items', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * Extracts title, first image, and clean text description from HTML string.
 */
export function parseHtmlBlog(htmlContent: string, fileName: string): { title: string; shortDescription: string; featuredImage?: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // 1. Extract Title
    let title = '';
    if (doc.title && doc.title.trim() !== '') {
      title = doc.title.trim();
    } else {
      const h1 = doc.querySelector('h1');
      if (h1 && h1.textContent?.trim()) {
        title = h1.textContent.trim();
      } else {
        const h2 = doc.querySelector('h2');
        if (h2 && h2.textContent?.trim()) {
          title = h2.textContent.trim();
        } else {
          // Fallback to pretty file name
          title = fileName.replace(/\.[^/.]+$/, '').split(/[-_]+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
      }
    }

    // 2. Extract Featured Image
    let featuredImage: string | undefined = undefined;
    const firstImg = doc.querySelector('img');
    if (firstImg && firstImg.src) {
      featuredImage = firstImg.getAttribute('src') || firstImg.src;
    }

    // 3. Extract description from text content
    // Strip styles, scripts, headings to get clean content sentences
    const tempDiv = doc.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove unwanted tags from description calculation
    const toRemove = tempDiv.querySelectorAll('script, style, h1, h2, h3, h4, h5, h6, img, iframe');
    toRemove.forEach(el => el.remove());

    const text = tempDiv.textContent || tempDiv.innerText || '';
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    let shortDescription = 'No description available.';
    if (cleanText) {
      if (cleanText.length > 180) {
        shortDescription = cleanText.substring(0, 180).trim() + '...';
      } else {
        shortDescription = cleanText;
      }
    }

    return { title, shortDescription, featuredImage };
  } catch (e) {
    console.error('Failed to parse HTML blog content:', e);
    return {
      title: fileName.replace(/\.[^/.]+$/, ''),
      shortDescription: 'Uploaded HTML blog article.'
    };
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .trim();
}

