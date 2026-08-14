import { Router } from 'express';
import { getSiteSettings, updateSiteSettings } from '../controllers/settings.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public route
router.get('/', getSiteSettings);

// Protected admin route
router.put('/', authenticateToken, requireAdmin, updateSiteSettings);

export default router;
