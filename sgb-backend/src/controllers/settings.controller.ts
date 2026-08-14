import { Request, Response } from 'express';
import { dbSiteSettings } from '../db/index.js';

export async function getSiteSettings(_req: Request, res: Response): Promise<void> {
  try {
    const settings = await dbSiteSettings.get();
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Error fetching site settings:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve site settings.' });
  }
}

export async function updateSiteSettings(req: Request, res: Response): Promise<void> {
  try {
    const updated = await dbSiteSettings.update(req.body);
    res.json({ success: true, message: 'Site settings updated successfully.', settings: updated });
  } catch (err) {
    console.error('Error updating site settings:', err);
    res.status(500).json({ success: false, message: 'Failed to update site settings.' });
  }
}
