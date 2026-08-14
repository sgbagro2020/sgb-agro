import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUserPassword,
  deleteUser,
} from '../controllers/user.controller.js';
import { authenticateToken, requireSuperadmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken, requireSuperadmin);

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id/password', updateUserPassword);
router.delete('/:id', deleteUser);

export default router;
