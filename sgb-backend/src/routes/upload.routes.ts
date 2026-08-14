import { Router } from 'express';
import {
  uploadProductImage,
  uploadGalleryMedia,
  uploadLogo,
  uploadBlogImage,
} from '../controllers/upload.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.post(
  '/product-image',
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  uploadProductImage
);

router.post(
  '/gallery-media',
  authenticateToken,
  requireAdmin,
  upload.single('file'),
  uploadGalleryMedia
);

router.post(
  '/logo',
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  uploadLogo
);

router.post(
  '/blog-image',
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  uploadBlogImage
);

export default router;
