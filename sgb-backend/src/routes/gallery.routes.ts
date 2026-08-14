import { Router } from 'express';
import {
  getGalleryMedia,
  getGalleryMediaById,
  createGalleryMedia,
  updateGalleryMedia,
  deleteGalleryMedia,
  getGalleryAlbums,
  getGalleryAlbumById,
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum,
} from '../controllers/gallery.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Gallery Media Routes
router.get('/media', getGalleryMedia);
router.get('/media/:id', getGalleryMediaById);
router.post('/media', authenticateToken, requireAdmin, createGalleryMedia);
router.put('/media/:id', authenticateToken, requireAdmin, updateGalleryMedia);
router.delete('/media/:id', authenticateToken, requireAdmin, deleteGalleryMedia);

// Gallery Albums Routes
router.get('/albums', getGalleryAlbums);
router.get('/albums/:id', getGalleryAlbumById);
router.post('/albums', authenticateToken, requireAdmin, createGalleryAlbum);
router.put('/albums/:id', authenticateToken, requireAdmin, updateGalleryAlbum);
router.delete('/albums/:id', authenticateToken, requireAdmin, deleteGalleryAlbum);

export default router;
