import { Request, Response } from 'express';
import crypto from 'crypto';
import { dbGalleryMedia, dbGalleryAlbums } from '../db/index.js';
import { GalleryMedia, GalleryAlbum } from '../db/schema.js';
import { validateGalleryMediaData } from '../utils/validators.js';

// Gallery Media Controllers
export async function getGalleryMedia(req: Request, res: Response): Promise<void> {
  try {
    let media = await dbGalleryMedia.getAll();

    const { category, type, featured } = req.query;

    media = media.filter(m => !m.hidden);

    if (category && typeof category === 'string') {
      media = media.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }

    if (type && typeof type === 'string') {
      media = media.filter(m => m.type.toLowerCase() === type.toLowerCase());
    }

    if (featured === 'true') {
      media = media.filter(m => m.featured);
    }

    res.json({ success: true, count: media.length, media });
  } catch (err) {
    console.error('Error fetching gallery media:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve gallery media.' });
  }
}

export async function getGalleryMediaById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const media = await dbGalleryMedia.getById(id);

    if (!media) {
      res.status(404).json({ success: false, message: 'Gallery media item not found.' });
      return;
    }

    res.json({ success: true, media });
  } catch (err) {
    console.error('Error fetching gallery media item:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve gallery media item.' });
  }
}

export async function createGalleryMedia(req: Request, res: Response): Promise<void> {
  try {
    const validationError = validateGalleryMediaData(req.body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const newMedia: GalleryMedia = {
      id: req.body.id || `media_${crypto.randomBytes(8).toString('hex')}`,
      title: req.body.title.trim(),
      caption: req.body.caption || '',
      category: req.body.category || 'General',
      type: req.body.type || 'image',
      url: req.body.url,
      uploadDate: req.body.uploadDate || new Date().toISOString().split('T')[0],
      featured: Boolean(req.body.featured),
      hidden: Boolean(req.body.hidden),
      order: req.body.order ? Number(req.body.order) : 0,
    };

    const created = await dbGalleryMedia.create(newMedia);
    res.status(201).json({ success: true, message: 'Gallery media added.', media: created });
  } catch (err) {
    console.error('Error creating gallery media:', err);
    res.status(500).json({ success: false, message: 'Failed to create gallery media.' });
  }
}

export async function updateGalleryMedia(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await dbGalleryMedia.update(id, req.body);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Gallery media item not found.' });
      return;
    }

    res.json({ success: true, message: 'Gallery media item updated.', media: updated });
  } catch (err) {
    console.error('Error updating gallery media:', err);
    res.status(500).json({ success: false, message: 'Failed to update gallery media.' });
  }
}

export async function deleteGalleryMedia(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await dbGalleryMedia.delete(id);

    if (!success) {
      res.status(404).json({ success: false, message: 'Gallery media item not found.' });
      return;
    }

    res.json({ success: true, message: 'Gallery media item deleted.' });
  } catch (err) {
    console.error('Error deleting gallery media:', err);
    res.status(500).json({ success: false, message: 'Failed to delete gallery media.' });
  }
}

// Gallery Albums Controllers
export async function getGalleryAlbums(_req: Request, res: Response): Promise<void> {
  try {
    const albums = await dbGalleryAlbums.getAll();
    res.json({ success: true, count: albums.length, albums });
  } catch (err) {
    console.error('Error fetching gallery albums:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve gallery albums.' });
  }
}

export async function getGalleryAlbumById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const album = await dbGalleryAlbums.getById(id);

    if (!album) {
      res.status(404).json({ success: false, message: 'Gallery album not found.' });
      return;
    }

    res.json({ success: true, album });
  } catch (err) {
    console.error('Error fetching gallery album:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve gallery album.' });
  }
}

export async function createGalleryAlbum(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, coverImageUrl, media } = req.body;

    if (!title || typeof title !== 'string') {
      res.status(400).json({ success: false, message: 'Album title is required.' });
      return;
    }

    const newAlbum: GalleryAlbum = {
      id: req.body.id || `album_${crypto.randomBytes(8).toString('hex')}`,
      title: title.trim(),
      description: description || '',
      coverImageUrl: coverImageUrl || '',
      uploadDate: new Date().toISOString().split('T')[0],
      media: Array.isArray(media) ? media : [],
    };

    const created = await dbGalleryAlbums.create(newAlbum);
    res.status(201).json({ success: true, message: 'Gallery album created.', album: created });
  } catch (err) {
    console.error('Error creating gallery album:', err);
    res.status(500).json({ success: false, message: 'Failed to create gallery album.' });
  }
}

export async function updateGalleryAlbum(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await dbGalleryAlbums.update(id, req.body);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Gallery album not found.' });
      return;
    }

    res.json({ success: true, message: 'Gallery album updated.', album: updated });
  } catch (err) {
    console.error('Error updating gallery album:', err);
    res.status(500).json({ success: false, message: 'Failed to update gallery album.' });
  }
}

export async function deleteGalleryAlbum(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await dbGalleryAlbums.delete(id);

    if (!success) {
      res.status(404).json({ success: false, message: 'Gallery album not found.' });
      return;
    }

    res.json({ success: true, message: 'Gallery album deleted.' });
  } catch (err) {
    console.error('Error deleting gallery album:', err);
    res.status(500).json({ success: false, message: 'Failed to delete gallery album.' });
  }
}
