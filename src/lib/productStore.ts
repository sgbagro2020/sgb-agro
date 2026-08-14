import { apiClient } from './apiClient';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/agriData';

export interface ProductStorageData {
  productId: string;
  productName: string;
  mainImage: string;
  galleryImages: string[];
  imageUrls: string[];
  lastUpdated: string;
}

export interface FirestoreSaveResult {
  success: boolean;
  error?: string;
  docId?: string;
}

/**
 * Legacy Seeder
 * Since we are no longer using Firestore, the backend manages database state.
 */
export const seedProductsToFirestore = async (force: boolean = false): Promise<void> => {
  console.log('Backend now manages database state. Skipping frontend seed.');
};

/**
 * Replaces Firestore real-time subscription with a REST fetch + polling.
 * Preserves the fallback to static data if the backend is unavailable.
 */
export const subscribeToProducts = (
  callback: (products: Product[]) => void,
  onError?: (error: Error) => void
) => {
  let isSubscribed = true;

  const fetchProducts = async () => {
    try {
      const products = await apiClient<Product[]>('/api/products');
      
      // Maintain consistent ordering
      products.sort((a, b) => {
        const orderA = (a as any).displayOrder ?? 99;
        const orderB = (b as any).displayOrder ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
      });

      if (isSubscribed) {
        callback(products.length > 0 ? products : INITIAL_PRODUCTS);
      }
    } catch (error) {
      console.error('Error fetching products from backend:', error);
      if (isSubscribed && onError) onError(error as Error);
      // Fallback to static data if backend is offline
      if (isSubscribed) callback(INITIAL_PRODUCTS);
    }
  };

  fetchProducts();
  
  // Poll every 30 seconds to simulate real-time updates for the admin dashboard
  const interval = setInterval(fetchProducts, 30000);

  return () => {
    isSubscribed = false;
    clearInterval(interval);
  };
};

/**
 * Fetch products once from Backend (formerly Firestore)
 */
export const getProductsFromFirestore = async (): Promise<Product[]> => {
  try {
    const products = await apiClient<Product[]>('/api/products');
    return products.length > 0 ? products : INITIAL_PRODUCTS;
  } catch (error) {
    console.error('Error getting products from backend:', error);
    return INITIAL_PRODUCTS; // Fallback
  }
};

/**
 * Save (create or update) a product in the Backend
 */
export const saveProductToFirestore = async (
  product: Partial<Product> & { id?: string; title: string }
): Promise<FirestoreSaveResult> => {
  try {
    const docId = product.id && product.id.trim().length > 0
      ? product.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-')
      : `sgb-prod-${Date.now()}`;

    const isNew = !product.id;
    const endpoint = isNew ? '/api/products' : `/api/products/${docId}`;
    const method = isNew ? 'POST' : 'PUT';

    const payload = { ...product, id: docId };

    await apiClient(endpoint, {
      method,
      data: payload,
    });

    console.log(`[Backend Success] Product "${docId}" saved successfully.`);
    return { docId, success: true };
  } catch (error: any) {
    console.error('[Backend Save Product Failed]', error);
    return { docId: product.id || '', success: false, error: error.message || 'Failed to save product.' };
  }
};

/**
 * Save product images using the backend upload route
 */
export const saveProductImagesToFirestore = async (
  productId: string,
  images: string[]
): Promise<FirestoreSaveResult> => {
  try {
    if (!productId) {
      return { success: false, error: 'Product ID is missing.' };
    }

    // Send base64 images to the backend's upload endpoint
    await apiClient('/api/upload/product', {
      method: 'POST',
      data: { productId, images },
    });

    console.log(`[Backend Success] Product "${productId}" images saved successfully.`);
    window.dispatchEvent(new Event('sgb_product_images_updated'));
    
    return { success: true };
  } catch (error: any) {
    console.error('[Backend Save Product Images Failed]', error);
    return { success: false, error: error.message || 'Upload failed.' };
  }
};

/**
 * Delete product via Backend
 */
export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  await apiClient(`/api/products/${productId}`, { method: 'DELETE' });
};

/**
 * Reorder products via Backend
 */
export const reorderProducts = async (orderedIds: string[]): Promise<void> => {
  await apiClient('/api/products/reorder', { 
    method: 'PATCH', 
    data: { orderedIds } 
  });
};

// ==========================================
// LEGACY GETTERS FOR UI COMPATIBILITY
// ==========================================

export const getCustomProductImages = (_productId: string): string[] | null => {
  // Return null to force the UI to rely on the backend/props data rather than local memory
  return null;
};

export const getProductMetaData = (_productId: string): ProductStorageData | null => {
  return null;
};

export const saveCustomProductImages = (
  productId: string,
  images: string[],
  productName?: string
): boolean => {
  console.log("Saving images for:", productName);
  saveProductImagesToFirestore(productId, images).catch((e) => {
    console.error("Failed to sync product images to backend:", e);
  });
  return true; // Optimistic UI return
};

export const removeCustomProductImages = (_productId: string): void => {
  window.dispatchEvent(new Event('sgb_product_images_updated'));
};

export const getEffectiveProduct = (product: Product): Product => {
  return product;
};