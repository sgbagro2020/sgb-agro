import { Request, Response } from 'express';
import { uploadFileToStorage } from '../services/storage.service.js';

export async function uploadProductImage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file provided for product image upload.' });
      return;
    }

    const result = await uploadFileToStorage(req.file, 'products');
    res.json({
      success: true,
      message: 'Product image uploaded successfully.',
      url: result.url,
      file: {
        filename: result.filename,
        mimetype: result.mimetype,
        size: result.size,
      },
    });
  } catch (err) {
    console.error('Error uploading product image:', err);
    res.status(500).json({ success: false, message: 'Failed to upload product image.' });
  }
}

export async function uploadGalleryMedia(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file provided for gallery media upload.' });
      return;
    }

    const result = await uploadFileToStorage(req.file, 'gallery');
    res.json({
      success: true,
      message: 'Gallery media uploaded successfully.',
      url: result.url,
      file: {
        filename: result.filename,
        mimetype: result.mimetype,
        size: result.size,
      },
    });
  } catch (err) {
    console.error('Error uploading gallery media:', err);
    res.status(500).json({ success: false, message: 'Failed to upload gallery media.' });
  }
}

export async function uploadLogo(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file provided for logo upload.' });
      return;
    }

    const result = await uploadFileToStorage(req.file, 'logos');
    res.json({
      success: true,
      message: 'Logo uploaded successfully.',
      url: result.url,
      file: {
        filename: result.filename,
        mimetype: result.mimetype,
        size: result.size,
      },
    });
  } catch (err) {
    console.error('Error uploading logo:', err);
    res.status(500).json({ success: false, message: 'Failed to upload logo.' });
  }
}

export async function uploadBlogImage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file provided for blog image upload.' });
      return;
    }

    const result = await uploadFileToStorage(req.file, 'blog');
    res.json({
      success: true,
      message: 'Blog image uploaded successfully.',
      url: result.url,
      file: {
        filename: result.filename,
        mimetype: result.mimetype,
        size: result.size,
      },
    });
  } catch (err) {
    console.error('Error uploading blog image:', err);
    res.status(500).json({ success: false, message: 'Failed to upload blog image.' });
  }
}
