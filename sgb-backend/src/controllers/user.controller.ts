import { Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { dbUsers } from '../db/index.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { isValidEmail } from '../utils/validators.js';

export async function getUsers(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await dbUsers.getAll();
    const sanitized = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    res.json({ success: true, count: sanitized.length, users: sanitized });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve admin users.' });
  }
}

export async function createUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
      return;
    }

    if (typeof password !== 'string' || password.length < 12) {
      res.status(400).json({ success: false, message: 'Password must be at least 12 characters long.' });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ success: false, message: 'Invalid email address.' });
      return;
    }

    const existing = await dbUsers.getByEmail(email);
    if (existing) {
      res.status(400).json({ success: false, message: 'An admin user with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const newUser = {
      id: `usr_${crypto.randomBytes(8).toString('hex')}`,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: (role === 'superadmin' ? 'superadmin' : 'admin') as 'admin' | 'superadmin',
      createdAt: now,
      updatedAt: now,
    };

    const created = await dbUsers.create(newUser);

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully.',
      user: {
        id: created.id,
        username: created.username,
        email: created.email,
        role: created.role,
        createdAt: created.createdAt,
      },
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ success: false, message: 'Failed to create admin user.' });
  }
}

export async function updateUserPassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 12) {
      res.status(400).json({ success: false, message: 'New password must be at least 12 characters long.' });
      return;
    }

    const user = await dbUsers.getById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await dbUsers.update(id, { passwordHash });

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Error updating user password:', err);
    res.status(500).json({ success: false, message: 'Failed to update user password.' });
  }
}

export async function deleteUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user && req.user.id === id) {
      res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
      return;
    }

    const success = await dbUsers.delete(id);
    if (!success) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({ success: true, message: 'Admin user deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Failed to delete admin user.' });
  }
}
