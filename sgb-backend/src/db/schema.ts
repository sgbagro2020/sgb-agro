export interface DownloadLink {
  title: string;
  fileUrl?: string;
  size?: string;
}

export interface Product {
  id: string;
  title: string;
  price?: string;
  originalPrice?: string;
  saveTag?: string;
  category: string;
  image: string;
  images: string[];
  shortDesc: string;
  fullDesc: string;
  sku: string;
  availability: string;
  brand: string;
  features: string[];
  specifications: Record<string, string>;
  applications: string[];
  benefits: string[];
  packageContents: string[];
  downloads?: DownloadLink[];
  badge?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryMedia {
  id: string;
  title: string;
  caption: string;
  category: string;
  type: 'image' | 'video';
  url: string;
  uploadDate: string;
  featured: boolean;
  hidden: boolean;
  order: number;
}

export interface GalleryAlbumItem {
  id: string;
  mediaId?: string;
  title?: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  order: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  uploadDate: string;
  media: GalleryAlbumItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  featuredImage?: string;
  slug: string;
  published: boolean;
  uploadDate: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  whatsapp?: string;
}

export interface SiteSettings {
  id: string;
  logoUrl: string;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: SocialLinks;
  metaTitle: string;
  metaDescription: string;
  heroBannerUrl?: string;
  footerText?: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}

export interface DBData {
  users: AdminUser[];
  products: Product[];
  galleryMedia: GalleryMedia[];
  galleryAlbums: GalleryAlbum[];
  blogPosts: BlogPost[];
  siteSettings: SiteSettings;
}
