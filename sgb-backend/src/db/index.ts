import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../config/index.js';
import {
  AdminUser,
  Product,
  GalleryMedia,
  GalleryAlbum,
  BlogPost,
  SiteSettings,
  DBData,
} from './schema.js';

// Local File DB path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initialize local directory if using JSON DB
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// PostgreSQL Pool instance
let pgPool: InstanceType<typeof Pool> | null = null;

if (config.db.type === 'postgres' || process.env.DATABASE_URL) {
  try {
    const connectionString = config.db.url || `postgres://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`;
    pgPool = new Pool({
      connectionString,
      ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
    });
    console.log('🐘 PostgreSQL Pool configured.');
  } catch (err) {
    console.error('Failed to initialize PostgreSQL pool:', err);
  }
}

// Memory cache for JSON DB
let inMemoryData: DBData | null = null;

function loadLocalDB(): DBData {
  if (inMemoryData) return inMemoryData;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryData = JSON.parse(raw);
      return inMemoryData!;
    } catch (e) {
      console.error('Error reading db.json, creating new file:', e);
    }
  }

  inMemoryData = {
    users: [],
    products: [],
    galleryMedia: [],
    galleryAlbums: [],
    blogPosts: [],
    siteSettings: {
      id: 'default',
      logoUrl: '/images/sgb-logo.png',
      siteName: 'SGB Agro Industries',
      contactEmail: 'info@sgbagro.com',
      contactPhone: '+91 9876543210',
      address: 'Industrial Estate, Agro Park, Sector 4, Gujarat, India',
      socialLinks: {
        facebook: 'https://facebook.com/sgbagro',
        instagram: 'https://instagram.com/sgbagro',
        youtube: 'https://youtube.com/sgbagro',
        linkedin: 'https://linkedin.com/company/sgbagro',
      },
      metaTitle: 'SGB Agro Industries - Leading Agricultural Solutions & Equipment',
      metaDescription: 'Manufacturer of high quality drip irrigation systems, vermicompost, solar water pumps, and agricultural sprayers.',
      heroBannerUrl: '/images/hero-banner.jpg',
      footerText: '© 2026 SGB Agro Industries. All rights reserved.',
      updatedAt: new Date().toISOString(),
    },
  };

  saveLocalDB();
  return inMemoryData;
}

function saveLocalDB() {
  if (!inMemoryData) return;
  fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryData, null, 2), 'utf-8');
}

export async function initDB() {
  if (pgPool) {
    try {
      // Create PostgreSQL tables
      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          price TEXT NOT NULL,
          original_price TEXT,
          save_tag TEXT,
          category TEXT NOT NULL,
          image TEXT NOT NULL,
          images JSONB DEFAULT '[]'::jsonb,
          short_desc TEXT NOT NULL,
          full_desc TEXT NOT NULL,
          sku TEXT NOT NULL,
          availability TEXT NOT NULL,
          brand TEXT NOT NULL,
          features JSONB DEFAULT '[]'::jsonb,
          specifications JSONB DEFAULT '{}'::jsonb,
          applications JSONB DEFAULT '[]'::jsonb,
          benefits JSONB DEFAULT '[]'::jsonb,
          package_contents JSONB DEFAULT '[]'::jsonb,
          downloads JSONB DEFAULT '[]'::jsonb,
          badge TEXT,
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS gallery_media (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          caption TEXT NOT NULL,
          category TEXT NOT NULL,
          type TEXT NOT NULL,
          url TEXT NOT NULL,
          upload_date TEXT NOT NULL,
          featured BOOLEAN DEFAULT false,
          hidden BOOLEAN DEFAULT false,
          media_order INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS gallery_albums (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          cover_image_url TEXT NOT NULL,
          upload_date TEXT NOT NULL,
          media JSONB DEFAULT '[]'::jsonb
        );

        CREATE TABLE IF NOT EXISTS blog_posts (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          short_description TEXT NOT NULL,
          content TEXT NOT NULL,
          featured_image TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          published BOOLEAN DEFAULT true,
          upload_date TEXT NOT NULL,
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS site_settings (
          id TEXT PRIMARY KEY,
          logo_url TEXT NOT NULL,
          site_name TEXT NOT NULL,
          contact_email TEXT NOT NULL,
          contact_phone TEXT NOT NULL,
          address TEXT NOT NULL,
          social_links JSONB DEFAULT '{}'::jsonb,
          meta_title TEXT NOT NULL,
          meta_description TEXT NOT NULL,
          hero_banner_url TEXT,
          footer_text TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ PostgreSQL tables verified / created.');
      return;
    } catch (err: any) {
      console.warn('⚠️ Could not connect to PostgreSQL database:', err.message || err);
      console.warn('⚠️ Falling back to Local JSON Database for development.');
      await pgPool.end().catch(() => {});
      pgPool = null;
    }
  }

  loadLocalDB();
  console.log('✅ Local JSON Database initialized at:', DB_FILE);
}

// Users Database Operations
export const dbUsers = {
  async getAll(): Promise<AdminUser[]> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM users ORDER BY created_at DESC');
      return res.rows.map(r => ({
        id: r.id,
        username: r.username,
        email: r.email,
        passwordHash: r.password_hash,
        role: r.role,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      }));
    }
    return loadLocalDB().users;
  },

  async getById(id: string): Promise<AdminUser | null> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        username: r.username,
        email: r.email,
        passwordHash: r.password_hash,
        role: r.role,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      };
    }
    const user = loadLocalDB().users.find(u => u.id === id);
    return user || null;
  },

  async getByEmail(email: string): Promise<AdminUser | null> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        username: r.username,
        email: r.email,
        passwordHash: r.password_hash,
        role: r.role,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      };
    }
    const user = loadLocalDB().users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async create(user: AdminUser): Promise<AdminUser> {
    if (pgPool) {
      await pgPool.query(
        `INSERT INTO users (id, username, email, password_hash, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [user.id, user.username, user.email, user.passwordHash, user.role, user.createdAt, user.updatedAt]
      );
      return user;
    }
    const db = loadLocalDB();
    db.users.push(user);
    saveLocalDB();
    return user;
  },

  async update(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
    if (pgPool) {
      const existing = await this.getById(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
      await pgPool.query(
        `UPDATE users SET username = $1, email = $2, password_hash = $3, role = $4, updated_at = $5 WHERE id = $6`,
        [updated.username, updated.email, updated.passwordHash, updated.role, updated.updatedAt, id]
      );
      return updated;
    }
    const db = loadLocalDB();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...updates, updatedAt: new Date().toISOString() };
    saveLocalDB();
    return db.users[idx];
  },

  async delete(id: string): Promise<boolean> {
    if (pgPool) {
      const res = await pgPool.query('DELETE FROM users WHERE id = $1', [id]);
      return (res.rowCount || 0) > 0;
    }
    const db = loadLocalDB();
    const initialLen = db.users.length;
    db.users = db.users.filter(u => u.id !== id);
    saveLocalDB();
    return db.users.length < initialLen;
  },
};

// Products Database Operations
export const dbProducts = {
  async getAll(): Promise<Product[]> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM products ORDER BY display_order ASC, created_at DESC');
      return res.rows.map(r => ({
        id: r.id,
        title: r.title,
        price: r.price,
        originalPrice: r.original_price || undefined,
        saveTag: r.save_tag,
        category: r.category,
        image: r.image,
        images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images,
        shortDesc: r.short_desc,
        fullDesc: r.full_desc,
        sku: r.sku,
        availability: r.availability,
        brand: r.brand,
        features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features,
        specifications: typeof r.specifications === 'string' ? JSON.parse(r.specifications) : r.specifications,
        applications: typeof r.applications === 'string' ? JSON.parse(r.applications) : r.applications,
        benefits: typeof r.benefits === 'string' ? JSON.parse(r.benefits) : r.benefits,
        packageContents: typeof r.package_contents === 'string' ? JSON.parse(r.package_contents) : r.package_contents,
        downloads: typeof r.downloads === 'string' ? JSON.parse(r.downloads) : r.downloads,
        badge: r.badge,
        displayOrder: r.display_order,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      }));
    }
    return loadLocalDB().products.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getById(id: string): Promise<Product | null> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM products WHERE id = $1 OR sku = $1', [id]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        title: r.title,
        price: r.price,
        originalPrice: r.original_price || undefined,
        saveTag: r.save_tag,
        category: r.category,
        image: r.image,
        images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images,
        shortDesc: r.short_desc,
        fullDesc: r.full_desc,
        sku: r.sku,
        availability: r.availability,
        brand: r.brand,
        features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features,
        specifications: typeof r.specifications === 'string' ? JSON.parse(r.specifications) : r.specifications,
        applications: typeof r.applications === 'string' ? JSON.parse(r.applications) : r.applications,
        benefits: typeof r.benefits === 'string' ? JSON.parse(r.benefits) : r.benefits,
        packageContents: typeof r.package_contents === 'string' ? JSON.parse(r.package_contents) : r.package_contents,
        downloads: typeof r.downloads === 'string' ? JSON.parse(r.downloads) : r.downloads,
        badge: r.badge,
        displayOrder: r.display_order,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      };
    }
    const product = loadLocalDB().products.find(p => p.id === id || p.sku === id);
    return product || null;
  },

  async create(product: Product): Promise<Product> {
    if (pgPool) {
      await pgPool.query(
        `INSERT INTO products (
          id, title, price, original_price, save_tag, category, image, images,
          short_desc, full_desc, sku, availability, brand, features, specifications,
          applications, benefits, package_contents, downloads, badge, display_order, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
        [
          product.id,
          product.title,
          product.price,
          product.originalPrice,
          product.saveTag,
          product.category,
          product.image,
          JSON.stringify(product.images || []),
          product.shortDesc,
          product.fullDesc,
          product.sku,
          product.availability,
          product.brand,
          JSON.stringify(product.features || []),
          JSON.stringify(product.specifications || {}),
          JSON.stringify(product.applications || []),
          JSON.stringify(product.benefits || []),
          JSON.stringify(product.packageContents || []),
          JSON.stringify(product.downloads || []),
          product.badge,
          product.displayOrder || 0,
          product.createdAt,
          product.updatedAt,
        ]
      );
      return product;
    }
    const db = loadLocalDB();
    db.products.push(product);
    saveLocalDB();
    return product;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (pgPool) {
      const existing = await this.getById(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
      await pgPool.query(
        `UPDATE products SET
          title=$1, price=$2, original_price=$3, save_tag=$4, category=$5, image=$6, images=$7,
          short_desc=$8, full_desc=$9, sku=$10, availability=$11, brand=$12, features=$13,
          specifications=$14, applications=$15, benefits=$16, package_contents=$17, downloads=$18,
          badge=$19, display_order=$20, updated_at=$21
        WHERE id=$22`,
        [
          updated.title,
          updated.price,
          updated.originalPrice,
          updated.saveTag,
          updated.category,
          updated.image,
          JSON.stringify(updated.images || []),
          updated.shortDesc,
          updated.fullDesc,
          updated.sku,
          updated.availability,
          updated.brand,
          JSON.stringify(updated.features || []),
          JSON.stringify(updated.specifications || {}),
          JSON.stringify(updated.applications || []),
          JSON.stringify(updated.benefits || []),
          JSON.stringify(updated.packageContents || []),
          JSON.stringify(updated.downloads || []),
          updated.badge,
          updated.displayOrder || 0,
          updated.updatedAt,
          id,
        ]
      );
      return updated;
    }
    const db = loadLocalDB();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...updates, updatedAt: new Date().toISOString() };
    saveLocalDB();
    return db.products[idx];
  },

  async delete(id: string): Promise<boolean> {
    if (pgPool) {
      const res = await pgPool.query('DELETE FROM products WHERE id = $1', [id]);
      return (res.rowCount || 0) > 0;
    }
    const db = loadLocalDB();
    const initialLen = db.products.length;
    db.products = db.products.filter(p => p.id !== id);
    saveLocalDB();
    return db.products.length < initialLen;
  },
};

// Gallery Media Database Operations
export const dbGalleryMedia = {
  async getAll(): Promise<GalleryMedia[]> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM gallery_media ORDER BY media_order ASC, upload_date DESC');
      return res.rows.map(r => ({
        id: r.id,
        title: r.title,
        caption: r.caption,
        category: r.category,
        type: r.type,
        url: r.url,
        uploadDate: r.upload_date,
        featured: r.featured,
        hidden: r.hidden,
        order: r.media_order,
      }));
    }
    return loadLocalDB().galleryMedia.sort((a, b) => a.order - b.order);
  },

  async getById(id: string): Promise<GalleryMedia | null> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM gallery_media WHERE id = $1', [id]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        title: r.title,
        caption: r.caption,
        category: r.category,
        type: r.type,
        url: r.url,
        uploadDate: r.upload_date,
        featured: r.featured,
        hidden: r.hidden,
        order: r.media_order,
      };
    }
    return loadLocalDB().galleryMedia.find(g => g.id === id) || null;
  },

  async create(media: GalleryMedia): Promise<GalleryMedia> {
    if (pgPool) {
      await pgPool.query(
        `INSERT INTO gallery_media (id, title, caption, category, type, url, upload_date, featured, hidden, media_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [media.id, media.title, media.caption, media.category, media.type, media.url, media.uploadDate, media.featured, media.hidden, media.order]
      );
      return media;
    }
    const db = loadLocalDB();
    db.galleryMedia.push(media);
    saveLocalDB();
    return media;
  },

  async update(id: string, updates: Partial<GalleryMedia>): Promise<GalleryMedia | null> {
    if (pgPool) {
      const existing = await this.getById(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates };
      await pgPool.query(
        `UPDATE gallery_media SET title=$1, caption=$2, category=$3, type=$4, url=$5, upload_date=$6, featured=$7, hidden=$8, media_order=$9 WHERE id=$10`,
        [updated.title, updated.caption, updated.category, updated.type, updated.url, updated.uploadDate, updated.featured, updated.hidden, updated.order, id]
      );
      return updated;
    }
    const db = loadLocalDB();
    const idx = db.galleryMedia.findIndex(g => g.id === id);
    if (idx === -1) return null;
    db.galleryMedia[idx] = { ...db.galleryMedia[idx], ...updates };
    saveLocalDB();
    return db.galleryMedia[idx];
  },

  async delete(id: string): Promise<boolean> {
    if (pgPool) {
      const res = await pgPool.query('DELETE FROM gallery_media WHERE id = $1', [id]);
      return (res.rowCount || 0) > 0;
    }
    const db = loadLocalDB();
    const initialLen = db.galleryMedia.length;
    db.galleryMedia = db.galleryMedia.filter(g => g.id !== id);
    saveLocalDB();
    return db.galleryMedia.length < initialLen;
  },
};

// Gallery Albums Database Operations
export const dbGalleryAlbums = {
  async getAll(): Promise<GalleryAlbum[]> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM gallery_albums ORDER BY upload_date DESC');
      return res.rows.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        coverImageUrl: r.cover_image_url,
        uploadDate: r.upload_date,
        media: typeof r.media === 'string' ? JSON.parse(r.media) : r.media,
      }));
    }
    return loadLocalDB().galleryAlbums;
  },

  async getById(id: string): Promise<GalleryAlbum | null> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM gallery_albums WHERE id = $1', [id]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        coverImageUrl: r.cover_image_url,
        uploadDate: r.upload_date,
        media: typeof r.media === 'string' ? JSON.parse(r.media) : r.media,
      };
    }
    return loadLocalDB().galleryAlbums.find(a => a.id === id) || null;
  },

  async create(album: GalleryAlbum): Promise<GalleryAlbum> {
    if (pgPool) {
      await pgPool.query(
        `INSERT INTO gallery_albums (id, title, description, cover_image_url, upload_date, media)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [album.id, album.title, album.description, album.coverImageUrl || '', album.uploadDate, JSON.stringify(album.media || [])]
      );
      return album;
    }
    const db = loadLocalDB();
    db.galleryAlbums.push(album);
    saveLocalDB();
    return album;
  },

  async update(id: string, updates: Partial<GalleryAlbum>): Promise<GalleryAlbum | null> {
    if (pgPool) {
      const existing = await this.getById(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates };
      await pgPool.query(
        `UPDATE gallery_albums SET title=$1, description=$2, cover_image_url=$3, upload_date=$4, media=$5 WHERE id=$6`,
        [updated.title, updated.description, updated.coverImageUrl || '', updated.uploadDate, JSON.stringify(updated.media || []), id]
      );
      return updated;
    }
    const db = loadLocalDB();
    const idx = db.galleryAlbums.findIndex(a => a.id === id);
    if (idx === -1) return null;
    db.galleryAlbums[idx] = { ...db.galleryAlbums[idx], ...updates };
    saveLocalDB();
    return db.galleryAlbums[idx];
  },

  async delete(id: string): Promise<boolean> {
    if (pgPool) {
      const res = await pgPool.query('DELETE FROM gallery_albums WHERE id = $1', [id]);
      return (res.rowCount || 0) > 0;
    }
    const db = loadLocalDB();
    const initialLen = db.galleryAlbums.length;
    db.galleryAlbums = db.galleryAlbums.filter(a => a.id !== id);
    saveLocalDB();
    return db.galleryAlbums.length < initialLen;
  },
};

// Blog Posts Database Operations
export const dbBlogPosts = {
  async getAll(): Promise<BlogPost[]> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM blog_posts ORDER BY display_order ASC, created_at DESC');
      return res.rows.map(r => ({
        id: r.id,
        title: r.title,
        shortDescription: r.short_description,
        content: r.content,
        featuredImage: r.featured_image,
        slug: r.slug,
        published: r.published,
        uploadDate: r.upload_date,
        displayOrder: r.display_order,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      }));
    }
    return loadLocalDB().blogPosts.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getByIdOrSlug(idOrSlug: string): Promise<BlogPost | null> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM blog_posts WHERE id = $1 OR slug = $1', [idOrSlug]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        title: r.title,
        shortDescription: r.short_description,
        content: r.content,
        featuredImage: r.featured_image,
        slug: r.slug,
        published: r.published,
        uploadDate: r.upload_date,
        displayOrder: r.display_order,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      };
    }
    return loadLocalDB().blogPosts.find(b => b.id === idOrSlug || b.slug === idOrSlug) || null;
  },

  async create(post: BlogPost): Promise<BlogPost> {
    if (pgPool) {
      await pgPool.query(
        `INSERT INTO blog_posts (id, title, short_description, content, featured_image, slug, published, upload_date, display_order, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [post.id, post.title, post.shortDescription, post.content, post.featuredImage || '', post.slug, post.published, post.uploadDate, post.displayOrder || 0, post.createdAt, post.updatedAt]
      );
      return post;
    }
    const db = loadLocalDB();
    db.blogPosts.push(post);
    saveLocalDB();
    return post;
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    if (pgPool) {
      const existing = await this.getByIdOrSlug(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
      await pgPool.query(
        `UPDATE blog_posts SET title=$1, short_description=$2, content=$3, featured_image=$4, slug=$5, published=$6, upload_date=$7, display_order=$8, updated_at=$9 WHERE id=$10`,
        [updated.title, updated.shortDescription, updated.content, updated.featuredImage || '', updated.slug, updated.published, updated.uploadDate, updated.displayOrder || 0, updated.updatedAt, id]
      );
      return updated;
    }
    const db = loadLocalDB();
    const idx = db.blogPosts.findIndex(b => b.id === id);
    if (idx === -1) return null;
    db.blogPosts[idx] = { ...db.blogPosts[idx], ...updates, updatedAt: new Date().toISOString() };
    saveLocalDB();
    return db.blogPosts[idx];
  },

  async delete(id: string): Promise<boolean> {
    if (pgPool) {
      const res = await pgPool.query('DELETE FROM blog_posts WHERE id = $1', [id]);
      return (res.rowCount || 0) > 0;
    }
    const db = loadLocalDB();
    const initialLen = db.blogPosts.length;
    db.blogPosts = db.blogPosts.filter(b => b.id !== id);
    saveLocalDB();
    return db.blogPosts.length < initialLen;
  },
};

// Site Settings Database Operations
export const dbSiteSettings = {
  async get(): Promise<SiteSettings> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM site_settings LIMIT 1');
      if (res.rows.length > 0) {
        const r = res.rows[0];
        return {
          id: r.id,
          logoUrl: r.logo_url,
          siteName: r.site_name,
          contactEmail: r.contact_email,
          contactPhone: r.contact_phone,
          address: r.address,
          socialLinks: typeof r.social_links === 'string' ? JSON.parse(r.social_links) : r.social_links,
          metaTitle: r.meta_title,
          metaDescription: r.meta_description,
          heroBannerUrl: r.hero_banner_url,
          footerText: r.footer_text,
          updatedAt: new Date(r.updated_at).toISOString(),
        };
      }
    }
    return loadLocalDB().siteSettings;
  },

  async update(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    if (pgPool) {
      const current = await this.get();
      const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
      await pgPool.query(
        `INSERT INTO site_settings (id, logo_url, site_name, contact_email, contact_phone, address, social_links, meta_title, meta_description, hero_banner_url, footer_text, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO UPDATE SET
           logo_url=$2, site_name=$3, contact_email=$4, contact_phone=$5, address=$6, social_links=$7, meta_title=$8, meta_description=$9, hero_banner_url=$10, footer_text=$11, updated_at=$12`,
        [
          updated.id || 'default',
          updated.logoUrl,
          updated.siteName,
          updated.contactEmail,
          updated.contactPhone,
          updated.address,
          JSON.stringify(updated.socialLinks || {}),
          updated.metaTitle,
          updated.metaDescription,
          updated.heroBannerUrl || '',
          updated.footerText || '',
          updated.updatedAt,
        ]
      );
      return updated;
    }
    const db = loadLocalDB();
    db.siteSettings = { ...db.siteSettings, ...updates, updatedAt: new Date().toISOString() };
    saveLocalDB();
    return db.siteSettings;
  },
};
