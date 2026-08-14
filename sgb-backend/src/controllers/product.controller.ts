import { Request, Response } from 'express';
import crypto from 'crypto';
import { dbProducts } from '../db/index.js';
import { Product } from '../db/schema.js';
import { validateProductData } from '../utils/validators.js';

function normalizeOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text ? text : undefined;
}

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    let products = await dbProducts.getAll();

    const { category, search, availability, brand } = req.query;

    if (category && typeof category === 'string') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (availability && typeof availability === 'string') {
      products = products.filter(p => p.availability.toLowerCase() === availability.toLowerCase());
    }

    if (brand && typeof brand === 'string') {
      products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      products = products.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const product = await dbProducts.getById(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve product.' });
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const validationError = validateProductData(req.body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: req.body.id || `prod_${crypto.randomBytes(8).toString('hex')}`,
      title: req.body.title.trim(),
      price: String(req.body.price).trim(),
      originalPrice: normalizeOptionalString(req.body.originalPrice),
      saveTag: normalizeOptionalString(req.body.saveTag),
      category: req.body.category.trim(),
      image: req.body.image,
      images: Array.isArray(req.body.images) ? req.body.images : [req.body.image],
      shortDesc: req.body.shortDesc || '',
      fullDesc: req.body.fullDesc || '',
      sku: req.body.sku || `SGB-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      availability: req.body.availability || 'In Stock',
      brand: req.body.brand || 'SGB Agro',
      features: Array.isArray(req.body.features) ? req.body.features : [],
      specifications: typeof req.body.specifications === 'object' && req.body.specifications ? req.body.specifications : {},
      applications: Array.isArray(req.body.applications) ? req.body.applications : [],
      benefits: Array.isArray(req.body.benefits) ? req.body.benefits : [],
      packageContents: Array.isArray(req.body.packageContents) ? req.body.packageContents : [],
      downloads: Array.isArray(req.body.downloads) ? req.body.downloads : [],
      badge: normalizeOptionalString(req.body.badge),
      displayOrder: req.body.displayOrder ? Number(req.body.displayOrder) : 0,
      createdAt: now,
      updatedAt: now,
    };

    const created = await dbProducts.create(newProduct);
    res.status(201).json({ success: true, message: 'Product created successfully.', product: created });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const existing = await dbProducts.getById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const updated = await dbProducts.update(id, req.body);
    res.json({ success: true, message: 'Product updated successfully.', product: updated });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await dbProducts.delete(id);

    if (!success) {
      res.status(404).json({ success: false, message: 'Product not found or already deleted.' });
      return;
    }

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
}

export async function reorderProducts(req: Request, res: Response): Promise<void> {
  try {
    const { orders } = req.body; // Array of { id: string, displayOrder: number }
    if (!Array.isArray(orders)) {
      res.status(400).json({ success: false, message: 'Orders must be an array of { id, displayOrder }' });
      return;
    }

    for (const item of orders) {
      if (item.id && typeof item.displayOrder === 'number') {
        await dbProducts.update(item.id, { displayOrder: item.displayOrder });
      }
    }

    res.json({ success: true, message: 'Product display orders updated.' });
  } catch (err) {
    console.error('Error reordering products:', err);
    res.status(500).json({ success: false, message: 'Failed to reorder products.' });
  }
}
