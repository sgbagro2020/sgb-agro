import trolleyImg1 from '../assets/images/sgb_brush_cutter_trolley_1_1786011204096.jpg';
import trolleyImg2 from '../assets/images/sgb_brush_cutter_trolley_2_1786011223432.jpg';
import trolleyImg3 from '../assets/images/sgb_brush_cutter_trolley_3_1786011242596.jpg';
import trolleyImg4 from '../assets/images/sgb_brush_cutter_trolley_4_1786011262338.jpg';
import trolleyImg5 from '../assets/images/sgb_brush_cutter_trolley_5_1786011285243.jpg';
import { GalleryAlbum } from '../types';
import { apiClient } from './apiClient';

export interface MediaItem {
  id: string;
  title: string;
  caption: string;
  category?: string;
  type: 'image' | 'video';
  url: string;
  uploadDate: string;
  featured?: boolean;
  hidden?: boolean;
  order?: number;
}

export const INITIAL_TROLLEY_MEDIA: MediaItem[] = [
  {
    id: 'trolley-media-1',
    title: 'SGB Brush Cutter Trolley - Side Profile',
    caption: 'Authentic orange mild steel heavy-duty frame with pneumatic spoked wheels and handle mounting clamp.',
    category: 'Garden Tools',
    type: 'image',
    url: trolleyImg1,
    uploadDate: '2026-08-01T10:00:00.000Z',
    featured: true,
    hidden: false,
    order: 0,
  },
  {
    id: 'trolley-media-2',
    title: 'SGB Brush Cutter Trolley - Front Angle',
    caption: 'Precision engineered push-type brush cutter trolley attachment reducing operator fatigue.',
    category: 'Garden Tools',
    type: 'image',
    url: trolleyImg2,
    uploadDate: '2026-08-02T10:00:00.000Z',
    featured: true,
    hidden: false,
    order: 1,
  },
  {
    id: 'trolley-media-3',
    title: 'SGB Brush Cutter Trolley - Wheel & Rim Detail',
    caption: 'Dual orange rim spoked pneumatic tires for smooth movement across plantation terrain and steep slopes.',
    category: 'Garden Tools',
    type: 'image',
    url: trolleyImg3,
    uploadDate: '2026-08-03T10:00:00.000Z',
    featured: false,
    hidden: false,
    order: 2,
  },
  {
    id: 'trolley-media-4',
    title: 'SGB Brush Cutter Trolley - Handle Clamp Detail',
    caption: 'Heavy-duty clamp and bracket for quick attachment to standard 28mm shaft brush cutters.',
    category: 'Garden Tools',
    type: 'image',
    url: trolleyImg4,
    uploadDate: '2026-08-04T10:00:00.000Z',
    featured: false,
    hidden: false,
    order: 3,
  },
  {
    id: 'trolley-media-5',
    title: 'SGB Brush Cutter Trolley - Complete Frame Assembly',
    caption: 'Full heavy-duty powder-coated trolley setup ready for estate grass clearing and farm weeding.',
    category: 'Garden Tools',
    type: 'image',
    url: trolleyImg5,
    uploadDate: '2026-08-05T10:00:00.000Z',
    featured: false,
    hidden: false,
    order: 4,
  },
];

// ==========================================
// ALBUM OPERATIONS (Backend Connected)
// ==========================================

export async function getAllAlbums(): Promise<GalleryAlbum[]> {
  try {
    const albums = await apiClient<GalleryAlbum[]>('/api/gallery/albums');
    
    // Safety check: Ensure the backend actually gave us an array before sorting
    if (Array.isArray(albums)) {
      albums.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      return albums;
    }
    return [];
  } catch (err) {
    console.warn('Failed to load albums from backend:', err);
    return [];
  }
}

export async function saveAlbum(album: GalleryAlbum): Promise<void> {
  try {
    const isNew = !album.id || album.id.startsWith('album-');
    
    // If it's a new "optimistic" local ID, remove it so the backend generates a UUID
    const payload = { ...album };
    if (isNew) {
      delete (payload as any).id;
      await apiClient('/api/gallery/albums', { method: 'POST', data: payload });
    } else {
      await apiClient(`/api/gallery/albums/${album.id}`, { method: 'PUT', data: payload });
    }
  } catch (err) {
    console.error('Failed to save album to backend:', err);
    throw err;
  }
}

export async function deleteAlbum(id: string): Promise<void> {
  try {
    // Prevent trying to delete local optimistic IDs from backend
    if (!id.startsWith('album-')) {
      await apiClient(`/api/gallery/albums/${id}`, { method: 'DELETE' });
    }
  } catch (err) {
    console.error('Failed to delete album from backend:', err);
    throw err;
  }
}

export async function saveAllAlbums(albums: GalleryAlbum[]): Promise<void> {
  // If bulk updating, save each individually
  try {
    for (const album of albums) {
      await saveAlbum(album);
    }
  } catch (err) {
    console.error('Failed to bulk save albums to backend:', err);
  }
}

// ==========================================
// MEDIA OPERATIONS (Backend Connected)
// ==========================================

export async function getAllMediaItems(): Promise<MediaItem[]> {
  try {
    const items = await apiClient<MediaItem[]>('/api/gallery/media');
    
    // Safety check: Ensure the backend actually gave us an array before sorting
    if (Array.isArray(items)) {
      items.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      });
      return items;
    }
    return [];
  } catch (err) {
    console.warn('Failed to load media from backend, falling back to static trolley media:', err);
    return [];
  }
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  try {
    const isNew = !item.id || item.id.startsWith('media-');
    const payload = { ...item };

    if (isNew) {
      delete (payload as any).id;
      // Note: If 'url' is a base64 string, backend must handle the upload properly
      await apiClient('/api/gallery/media', { method: 'POST', data: payload });
    } else {
      await apiClient(`/api/gallery/media/${item.id}`, { method: 'PUT', data: payload });
    }
  } catch (err) {
    console.error('Failed to save media to backend:', err);
    throw err;
  }
}

export async function deleteMediaItem(id: string): Promise<void> {
  try {
    if (!id.startsWith('media-')) {
      await apiClient(`/api/gallery/media/${id}`, { method: 'DELETE' });
    }
  } catch (err) {
    console.error('Failed to delete media from backend:', err);
    throw err;
  }
}

export async function saveAllMediaItems(items: MediaItem[]): Promise<void> {
  try {
    // The backend handles bulk reordering via a PATCH endpoint. 
    // We will extract just the IDs in their new order and send that.
    const orderedIds = items.map(i => i.id).filter(id => !id.startsWith('media-'));
    
    if (orderedIds.length > 0) {
       // Note: Assumes a backend route exists for bulk reorder, similar to products.
       // If it doesn't, we will fall back to updating them one by one.
       try {
         await apiClient('/api/gallery/media/reorder', { method: 'PATCH', data: { orderedIds } });
       } catch {
         // Fallback: update individually
         for (let i = 0; i < items.length; i++) {
           const updatedItem = { ...items[i], order: i };
           await saveMediaItem(updatedItem);
         }
       }
    }
  } catch (err) {
    console.error('Failed to save all media to backend:', err);
  }
}