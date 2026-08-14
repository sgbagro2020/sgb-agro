export interface Product {
  id: string;
  title: string;
  price?: string;
  originalPrice?: string;
  saveTag?: string;
  category: string;
  image: string;
  images?: string[];
  shortDesc: string;
  fullDesc?: string;
  sku?: string;
  availability?: string;
  brand?: string;
  features?: string[];
  specifications?: { [key: string]: string };
  applications?: string[];
  benefits?: string[];
  packageContents?: string[];
  compatibility?: string[];
  downloads?: { title: string; size?: string; fileUrl?: string }[];
  badge?: string;
}

export interface Service {
  id: string;
  stepNumber?: string;
  title: string;
  icon: string;
  description: string;
  details?: string[];
  imageUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  issuer: string;
  year: string;
  description: string;
  highlights: string[];
  badge: string;
}

export interface MediaItem {
  id: string;
  title: string;
  caption: string;
  category?: string;
  type: 'image' | 'video';
  url: string;
  uploadDate: string;
  featured?: boolean;
  hidden?: boolean;
  order?: number;
}

export type GalleryItem = MediaItem;

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  cropType: string;
  quote: string;
  rating: number;
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  location: string;
  productInterest: string;
  message: string;
}

export interface AlbumMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  order: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string; // ID or URL of the cover image. Defaults to first image's url if empty.
  uploadDate: string;
  media: AlbumMediaItem[];
}
