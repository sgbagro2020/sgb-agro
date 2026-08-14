import { Router } from 'express';
import {
  getBlogPosts,
  getBlogPostByIdOrSlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blog.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getBlogPosts);
router.get('/:idOrSlug', getBlogPostByIdOrSlug);

// Protected admin routes
router.post('/', authenticateToken, requireAdmin, createBlogPost);
router.put('/:id', authenticateToken, requireAdmin, updateBlogPost);
router.delete('/:id', authenticateToken, requireAdmin, deleteBlogPost);

export default router;
