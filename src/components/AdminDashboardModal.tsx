import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem, saveMediaItem, deleteMediaItem, saveAllMediaItems, getAllMediaItems, getAllAlbums, saveAlbum, deleteAlbum, saveAllAlbums } from '../lib/galleryStore';
import { GalleryAlbum, AlbumMediaItem } from '../types';
import { BlogItem, getAllBlogs, saveBlog, deleteBlog, saveAllBlogs, parseHtmlBlog, slugify } from '../lib/blogStore';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Eye,
  EyeOff,
  Edit2,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  Check,
  Star,
  Sparkles,
  FileText,
  Film,
  FolderPlus,
  ArrowLeft,
  BookOpen,
  FileCode,
  Save,
  Lock,
  ExternalLink,
  ShoppingCart,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { PRODUCTS } from '../data/agriData';
import { getCustomProductImages, saveCustomProductImages, removeCustomProductImages } from '../lib/productStore';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  onRefresh: () => void;
  onLogout: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  mediaItems,
  onRefresh,
  onLogout,
}) => {
  // Navigation states: 'menu' | 'gallery' | 'blog' | 'products'
  const [currentView, setCurrentView] = useState<'menu' | 'gallery' | 'blog' | 'products'>('menu');

  // PRODUCT MANAGEMENT STATE
  const [draftProductImages, setDraftProductImages] = useState<Record<string, string[]>>({});
  const [activeUploadProductId, setActiveUploadProductId] = useState<string | null>(null);
  const [selectedMainImgIdx, setSelectedMainImgIdx] = useState<Record<string, number>>({});
  const productFileInputRef = useRef<HTMLInputElement>(null);

  const loadAllProductImages = () => {
    const drafts: Record<string, string[]> = {};
    const mainIndices: Record<string, number> = {};
    PRODUCTS.forEach((prod) => {
      const saved = getCustomProductImages(prod.id);
      if (saved && saved.length > 0) {
        drafts[prod.id] = [...saved];
      } else {
        const defaultImgs = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
        drafts[prod.id] = [...defaultImgs];
      }
      mainIndices[prod.id] = 0;
    });
    setDraftProductImages(drafts);
    setSelectedMainImgIdx(mainIndices);
  };

  useEffect(() => {
    if (isOpen && currentView === 'products') {
      loadAllProductImages();
    }
  }, [isOpen, currentView]);

  const triggerUploadForProduct = (productId: string) => {
    setActiveUploadProductId(productId);
    if (productFileInputRef.current) {
      productFileInputRef.current.value = '';
      productFileInputRef.current.click();
    }
  };

  const handleProductFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeUploadProductId) return;

    const targetId = activeUploadProductId;
    const prodObj = PRODUCTS.find((p) => p.id === targetId);
    const prodTitle = prodObj ? prodObj.title : targetId;
    const fileList = Array.from(files);
    const newImages: string[] = [];

    for (const file of fileList) {
      if (!file.type.startsWith('image/')) continue;
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file);
      });
      if (dataUrl) newImages.push(dataUrl);
    }

    if (newImages.length > 0) {
      // Use the current draft state instead of the legacy helper
      const currentSaved = draftProductImages[targetId] || [];
      const updatedList = [...currentSaved, ...newImages];

      // Save to Render backend via our updated store function
      const success = saveCustomProductImages(targetId, updatedList, prodTitle);

      if (success) {
        setDraftProductImages((prev) => ({
          ...prev,
          [targetId]: updatedList,
        }));

        showNotification(
          'success',
          '✅ Product images uploaded to Render successfully.'
        );
        if (onRefresh) onRefresh();
      } else {
        showNotification('error', 'Unable to save product images. Please try again.');
      }
    } else {
      showNotification('error', 'Please select valid image files.');
    }
  };

  const handleSetMainImage = (productId: string, index: number) => {
    const prodObj = PRODUCTS.find((p) => p.id === productId);
    const list = [...(draftProductImages[productId] || [])];
    if (index <= 0 || index >= list.length) return;
    const [selectedImg] = list.splice(index, 1);
    list.unshift(selectedImg);

    const success = saveCustomProductImages(productId, list, prodObj?.title);
    if (success) {
      setDraftProductImages((prev) => ({ ...prev, [productId]: list }));
      showNotification('success', '✅ Product images uploaded and saved successfully.');
      if (onRefresh) onRefresh();
    }
  };

  const handleRemoveProductImage = (productId: string, index: number) => {
    const prodObj = PRODUCTS.find((p) => p.id === productId);
    const list = [...(draftProductImages[productId] || [])];
    list.splice(index, 1);

    if (list.length === 0) {
      handleResetProductToDefault(prodObj || { id: productId, title: productId, image: '' });
      return;
    }

    const success = saveCustomProductImages(productId, list, prodObj?.title);
    if (success) {
      setDraftProductImages((prev) => ({ ...prev, [productId]: list }));
      showNotification('success', '✅ Product images updated and saved successfully.');
      if (onRefresh) onRefresh();
    }
  };

  const handleMoveProductImage = (productId: string, index: number, direction: 'left' | 'right') => {
    const prodObj = PRODUCTS.find((p) => p.id === productId);
    const list = [...(draftProductImages[productId] || [])];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const success = saveCustomProductImages(productId, list, prodObj?.title);
    if (success) {
      setDraftProductImages((prev) => ({ ...prev, [productId]: list }));
      showNotification('success', '✅ Product images reordered and saved successfully.');
      if (onRefresh) onRefresh();
    }
  };

  const handleSaveChangesForProduct = (prod: { id: string; title: string }) => {
    try {
      const imagesToSave = draftProductImages[prod.id] || [];
      if (imagesToSave.length === 0) {
        showNotification('error', 'Unable to save product images. Please try again.');
        return;
      }

      const success = saveCustomProductImages(prod.id, imagesToSave, prod.title);
      if (success) {
        showNotification('success', '✅ Product images uploaded and saved successfully.');
        if (onRefresh) onRefresh();
      } else {
        showNotification('error', 'Unable to save product images. Please try again.');
      }
    } catch (err) {
      showNotification('error', 'Unable to save product images. Please try again.');
    }
  };

  const handleResetProductToDefault = (prod: { id: string; title: string; image: string; images?: string[] }) => {
    removeCustomProductImages(prod.id);
    const defaultImgs = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
    setDraftProductImages((prev) => ({
      ...prev,
      [prod.id]: [...defaultImgs],
    }));
    showNotification('success', 'Reset product images to default system graphics.');
    if (onRefresh) onRefresh();
  };

  // ALBUM STATE
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [albumViewMode, setAlbumViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedAlbumForEdit, setSelectedAlbumForEdit] = useState<GalleryAlbum | null>(null);

  // Create Album Form State
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumMedia, setNewAlbumMedia] = useState<AlbumMediaItem[]>([]);
  const [albumUploading, setAlbumUploading] = useState(false);

  // Edit Album Form State
  const [editAlbumTitle, setEditAlbumTitle] = useState('');
  const [editAlbumDesc, setEditAlbumDesc] = useState('');

  // Load albums helper
  const loadAlbums = async () => {
    const fetched = await getAllAlbums();
    setAlbums(fetched);
  };

  useEffect(() => {
    if (isOpen) {
      loadAlbums();
    }
  }, [isOpen]);

  // GALLERY STATE
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccessCount, setUploadSuccessCount] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('General');
  const [isFeatured, setIsFeatured] = useState(false);

  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);

  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // BLOG STATE
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [blogActiveTab, setBlogActiveTab] = useState<'upload' | 'manage'>('upload');
  const [blogDragActive, setBlogDragActive] = useState(false);
  const [blogUploading, setBlogUploading] = useState(false);
  const [blogUploadSuccess, setBlogUploadSuccess] = useState<string | null>(null);

  // Blog Upload form state
  const [blogHtmlContent, setBlogHtmlContent] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogShortDescription, setBlogShortDescription] = useState('');
  const [blogFeaturedImage, setBlogFeaturedImage] = useState('');
  const [blogIsPublished, setBlogIsPublished] = useState(true);

  // Blog edit state
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [editBlogTitle, setEditBlogTitle] = useState('');
  const [editBlogShortDescription, setEditBlogShortDescription] = useState('');
  const [editBlogFeaturedImage, setEditBlogFeaturedImage] = useState('');
  const [editBlogContent, setEditBlogContent] = useState('');
  const [editBlogPublished, setEditBlogPublished] = useState(true);

  // Blog preview state
  const [previewBlog, setPreviewBlog] = useState<BlogItem | null>(null);
  const blogFileInputRef = useRef<HTMLInputElement>(null);

  // DELETE CONFIRMATION STATE
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    type: 'gallery' | 'blog';
    id: string;
  }>({ show: false, type: 'gallery', id: '' });

  // NOTIFICATION STATE
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((current) => {
        if (current && current.message === message) {
          return null;
        }
        return current;
      });
    }, 4000);
  };

  // Load blogs on open or view switch
  const loadBlogs = async () => {
    const list = await getAllBlogs();
    setBlogs(list);
  };

  useEffect(() => {
    if (isOpen) {
      loadBlogs();
    }
  }, [isOpen, currentView]);

  if (!isOpen) return null;

  // ==========================================
  // GALLERY HANDLERS
  // ==========================================
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    setUploading(true);
    setUploadSuccessCount(null);
    let count = 0;

    for (const file of files) {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name);
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

      if (!isImage && !isVideo) continue;

      try {
        const dataUrl = await readFileAsDataUrl(file);
        const newItem: MediaItem = {
          id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          title: title.trim() || file.name.replace(/\.[^/.]+$/, ''),
          caption: caption.trim() || (isVideo ? 'Video clip of agricultural operations' : 'High quality field image'),
          category: category.trim() || 'General',
          type: isVideo ? 'video' : 'image',
          url: dataUrl,
          uploadDate: new Date().toISOString(),
          featured: isFeatured,
          hidden: false,
          order: 0,
        };

        await saveMediaItem(newItem);
        count++;
      } catch (err) {
        console.error('Failed to read file:', err);
      }
    }

    setUploading(false);
    setUploadSuccessCount(count);
    setTitle('');
    setCaption('');
    setIsFeatured(false);
    onRefresh();

    if (count > 0) {
      setTimeout(() => {
        setActiveTab('manage');
      }, 1000);
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({
      show: true,
      type: 'gallery',
      id,
    });
  };

  const handleToggleHide = async (item: MediaItem) => {
    const updated = { ...item, hidden: !item.hidden };
    await saveMediaItem(updated);
    onRefresh();
  };

  const handleToggleFeatured = async (item: MediaItem) => {
    const updated = { ...item, featured: !item.featured };
    await saveMediaItem(updated);
    onRefresh();
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...mediaItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    await saveAllMediaItems(newItems);
    onRefresh();
  };

  const handleStartEdit = (item: MediaItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCaption(item.caption);
    setEditCategory(item.category || 'General');
    setEditFeatured(!!item.featured);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    const updated: MediaItem = {
      ...editingItem,
      title: editTitle,
      caption: editCaption,
      category: editCategory,
      featured: editFeatured,
    };
    await saveMediaItem(updated);
    setEditingItem(null);
    onRefresh();
  };

  // ==========================================
  // BLOG HANDLERS
  // ==========================================
  const handleBlogDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setBlogDragActive(true);
    } else if (e.type === 'dragleave') {
      setBlogDragActive(false);
    }
  };

  const handleBlogDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBlogDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processBlogFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleBlogFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processBlogFiles(Array.from(e.target.files));
    }
  };

  const processBlogFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.html')) {
      alert('Only .html files are supported for blog articles.');
      return;
    }

    setBlogUploading(true);
    setBlogUploadSuccess(null);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsed = parseHtmlBlog(text, file.name);

        setBlogHtmlContent(text);
        setBlogTitle(parsed.title);
        setBlogShortDescription(parsed.shortDescription);
        setBlogFeaturedImage(parsed.featuredImage || '');
        setBlogIsPublished(true);
        setBlogUploading(false);
        setBlogUploadSuccess(`Successfully read and parsed "${file.name}"! Feel free to adjust the extracted details before saving.`);
      };
      reader.onerror = () => {
        alert('Failed to read file.');
        setBlogUploading(false);
      };
      reader.readAsText(file);
    } catch (err) {
      console.error(err);
      setBlogUploading(false);
    }
  };

  const handleSaveNewBlog = async () => {
    if (!blogTitle.trim()) {
      alert('Blog title is required.');
      return;
    }
    if (!blogHtmlContent.trim()) {
      alert('HTML content is empty. Please upload an HTML file first.');
      return;
    }

    const newItem: BlogItem = {
      id: 'blog-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title: blogTitle.trim(),
      shortDescription: blogShortDescription.trim(),
      content: blogHtmlContent,
      featuredImage: blogFeaturedImage.trim() || undefined,
      uploadDate: new Date().toISOString(),
      published: blogIsPublished,
      order: blogs.length,
      slug: slugify(blogTitle.trim()),
    };

    await saveBlog(newItem);
    setBlogTitle('');
    setBlogShortDescription('');
    setBlogHtmlContent('');
    setBlogFeaturedImage('');
    setBlogUploadSuccess(null);
    setBlogActiveTab('manage');
    loadBlogs();
    onRefresh(); // Refresh parent view trigger
  };

  const handleDeleteBlog = (id: string) => {
    setDeleteConfirm({
      show: true,
      type: 'blog',
      id,
    });
  };

  const executeDelete = async () => {
    const { type, id } = deleteConfirm;
    setDeleteConfirm({ show: false, type: 'gallery', id: '' });

    try {
      if (type === 'gallery') {
        const items = await getAllMediaItems();
        const item = items.find((i) => i.id === id);

        if (!item) {
          // If already missing from database/storage, remove anyway
          await deleteMediaItem(id);
          showNotification('success', 'File deleted successfully.');
          onRefresh();
          return;
        }

        // Check if the storage file (url) exists or is already missing
        const fileExists = !!item.url;
        if (!fileExists) {
          // Clean up orphan database record
          await deleteMediaItem(id);
          showNotification('success', 'File deleted successfully.');
          onRefresh();
          return;
        }

        // Simulate deleting the file from storage by clearing the url property
        item.url = '';
        await saveMediaItem(item);
        // Delete database record
        await deleteMediaItem(id);

        showNotification('success', 'File deleted successfully.');
        onRefresh();
      } else {
        const allBlogsList = await getAllBlogs();
        const blog = allBlogsList.find((b) => b.id === id);

        if (!blog) {
          await deleteBlog(id);
          loadBlogs();
          onRefresh();
          showNotification('success', 'Blog deleted successfully.');
          return;
        }

        // Check if the blog's HTML file content or featured image exists
        const hasContent = !!blog.content;
        if (!hasContent) {
          await deleteBlog(id);
          loadBlogs();
          onRefresh();
          showNotification('success', 'Blog deleted successfully.');
          return;
        }

        // Clear the HTML file content from storage
        blog.content = '';
        await saveBlog(blog);
        // Delete blog metadata database record
        await deleteBlog(id);

        loadBlogs();
        onRefresh();
        showNotification('success', 'Blog deleted successfully.');
      }
    } catch (err: any) {
      console.error('Deletion failed with error:', err);
      showNotification('error', `Deletion failed: ${err?.message || 'Unknown error'}`);
    }
  };

  // ALBUM HANDLER OPERATIONS
  const handleCreateAlbum = async () => {
    if (!newAlbumTitle.trim()) {
      alert('Album title is required');
      return;
    }

    setAlbumUploading(true);
    const newAlbum: GalleryAlbum = {
      id: 'album-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title: newAlbumTitle.trim(),
      description: newAlbumDesc.trim(),
      uploadDate: new Date().toISOString(),
      media: newAlbumMedia,
    };

    await saveAlbum(newAlbum);
    setAlbumUploading(false);
    
    // Reset Create form
    setNewAlbumTitle('');
    setNewAlbumDesc('');
    setNewAlbumMedia([]);
    setAlbumViewMode('list');
    loadAlbums();
    onRefresh();
  };

  const handleStartEditAlbum = (album: GalleryAlbum) => {
    setSelectedAlbumForEdit(album);
    setEditAlbumTitle(album.title);
    setEditAlbumDesc(album.description || '');
    setAlbumViewMode('edit');
  };

  const handleSaveAlbumMeta = async () => {
    if (!selectedAlbumForEdit) return;
    if (!editAlbumTitle.trim()) {
      alert('Album title is required');
      return;
    }

    const updated: GalleryAlbum = {
      ...selectedAlbumForEdit,
      title: editAlbumTitle.trim(),
      description: editAlbumDesc.trim(),
    };

    await saveAlbum(updated);
    setSelectedAlbumForEdit(updated);
    loadAlbums();
    onRefresh();
    alert('Album information updated successfully!');
  };

  const handleAddMoreMediaToAlbum = async (files: File[]) => {
    if (!selectedAlbumForEdit) return;
    setAlbumUploading(true);

    const updatedMedia = [...selectedAlbumForEdit.media];
    let maxOrder = updatedMedia.reduce((max, item) => Math.max(max, item.order), -1);

    for (const file of files) {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name);
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

      if (!isImage && !isVideo) continue;

      try {
        const dataUrl = await readFileAsDataUrl(file);
        maxOrder++;
        updatedMedia.push({
          id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          type: isVideo ? 'video' : 'image',
          url: dataUrl,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          order: maxOrder,
        });
      } catch (err) {
        console.error('Failed to read file:', err);
      }
    }

    const updated: GalleryAlbum = {
      ...selectedAlbumForEdit,
      media: updatedMedia,
    };

    await saveAlbum(updated);
    setSelectedAlbumForEdit(updated);
    setAlbumUploading(false);
    loadAlbums();
    onRefresh();
  };

  const handleDeleteAlbumItem = async (itemId: string) => {
    if (!selectedAlbumForEdit) return;
    if (!confirm('Are you sure you want to delete this media item from the album?')) return;
    
    const updatedMedia = selectedAlbumForEdit.media.filter(m => m.id !== itemId);
    let coverUrl = selectedAlbumForEdit.coverImageUrl;
    if (coverUrl) {
      const coverStillExists = updatedMedia.some(m => m.url === coverUrl);
      if (!coverStillExists) {
        coverUrl = undefined;
      }
    }

    const updated: GalleryAlbum = {
      ...selectedAlbumForEdit,
      media: updatedMedia,
      coverImageUrl: coverUrl,
    };

    await saveAlbum(updated);
    setSelectedAlbumForEdit(updated);
    loadAlbums();
    onRefresh();
  };

  const handleMoveAlbumItem = async (index: number, direction: 'up' | 'down') => {
    if (!selectedAlbumForEdit) return;

    const mediaList = [...selectedAlbumForEdit.media];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mediaList.length) return;

    const temp = mediaList[index];
    mediaList[index] = mediaList[targetIndex];
    mediaList[targetIndex] = temp;

    const updatedMedia = mediaList.map((item, idx) => ({ ...item, order: idx }));

    const updated: GalleryAlbum = {
      ...selectedAlbumForEdit,
      media: updatedMedia,
    };

    await saveAlbum(updated);
    setSelectedAlbumForEdit(updated);
    loadAlbums();
    onRefresh();
  };

  const handleSetAlbumCover = async (itemUrl: string) => {
    if (!selectedAlbumForEdit) return;

    const updated: GalleryAlbum = {
      ...selectedAlbumForEdit,
      coverImageUrl: itemUrl,
    };

    await saveAlbum(updated);
    setSelectedAlbumForEdit(updated);
    loadAlbums();
    onRefresh();
  };

  const handleDeleteAlbumEntirely = async (albumId: string) => {
    if (!confirm('Are you sure you want to delete this entire album? All images and videos in this album will be permanently deleted.')) {
      return;
    }

    await deleteAlbum(albumId);
    setAlbumViewMode('list');
    setSelectedAlbumForEdit(null);
    loadAlbums();
    onRefresh();
  };

  const handleCreateAlbumFilesSelect = async (files: File[]) => {
    setAlbumUploading(true);
    const mediaList = [...newAlbumMedia];
    let maxOrder = mediaList.reduce((max, item) => Math.max(max, item.order), -1);

    for (const file of files) {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name);
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

      if (!isImage && !isVideo) continue;

      try {
        const dataUrl = await readFileAsDataUrl(file);
        maxOrder++;
        mediaList.push({
          id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          type: isVideo ? 'video' : 'image',
          url: dataUrl,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          order: maxOrder,
        });
      } catch (err) {
        console.error('Failed to read file:', err);
      }
    }
    setNewAlbumMedia(mediaList);
    setAlbumUploading(false);
  };

  const handleTogglePublish = async (blog: BlogItem) => {
    const updated = { ...blog, published: !blog.published };
    await saveBlog(updated);
    loadBlogs();
    onRefresh();
  };

  const handleMoveBlog = async (index: number, direction: 'up' | 'down') => {
    const newBlogs = [...blogs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlogs.length) return;

    const temp = newBlogs[index];
    newBlogs[index] = newBlogs[targetIndex];
    newBlogs[targetIndex] = temp;

    await saveAllBlogs(newBlogs);
    loadBlogs();
    onRefresh();
  };

  const handleStartEditBlog = (blog: BlogItem) => {
    setEditingBlog(blog);
    setEditBlogTitle(blog.title);
    setEditBlogShortDescription(blog.shortDescription);
    setEditBlogFeaturedImage(blog.featuredImage || '');
    setEditBlogContent(blog.content);
    setEditBlogPublished(blog.published);
  };

  const handleSaveBlogEdit = async () => {
    if (!editingBlog) return;
    const updated: BlogItem = {
      ...editingBlog,
      title: editBlogTitle,
      shortDescription: editBlogShortDescription,
      featuredImage: editBlogFeaturedImage || undefined,
      content: editBlogContent,
      published: editBlogPublished,
    };
    await saveBlog(updated);
    setEditingBlog(null);
    loadBlogs();
    onRefresh();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full my-6 overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="bg-[#064e3b] text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Welcome, Administrator</h2>
                <p className="text-xs text-emerald-200">
                  {currentView === 'menu' && 'SGB AGRO INDUSTRIES • Central Management Hub'}
                  {currentView === 'gallery' && '📷 Gallery Management'}
                  {currentView === 'blog' && '📝 Blog Management'}
                  {currentView === 'products' && '🛒 Product Management'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentView !== 'menu' && (
                <button
                  onClick={() => setCurrentView('menu')}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 mr-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Main Options</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 text-xs font-bold transition-colors"
              >
                Logout
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* VIEW 1: SELECTION MENU */}
            {currentView === 'menu' && (
              <motion.div
                key="dashboard-menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 sm:p-12 overflow-y-auto flex-1 bg-slate-50/50 flex flex-col justify-center min-h-[400px]"
              >
                <div className="max-w-3xl mx-auto w-full text-center mb-8">
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-600 mb-2">Central Admin Hub</h3>
                  <p className="text-slate-500 text-sm">Select which section of the website you would like to edit or update today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
                  {/* Option 1: Gallery Management */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col h-full group"
                    onClick={() => setCurrentView('gallery')}
                  >
                    <div className="w-14 h-14 bg-emerald-50 text-[#064e3b] rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-[#064e3b] group-hover:text-white transition-colors">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                      📷 Gallery Management
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed flex-1">
                      Control the visual assets. Add or remove high-quality photos and operational videos that showcase our machinery.
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Upload Photos</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Upload Videos</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Delete Media</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Reorder Gallery</span>
                    </div>
                  </motion.div>

                  {/* Option 2: Blog Management */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col h-full group"
                    onClick={() => setCurrentView('blog')}
                  >
                    <div className="w-14 h-14 bg-emerald-50 text-[#064e3b] rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-[#064e3b] group-hover:text-white transition-colors">
                      <FileText className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                      📝 Blog Management
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed flex-1">
                      Publish informative, rich HTML blog articles directly to our new Blog tab. Keep farmers up-to-date.
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Upload HTML Blog</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Preview Blog</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Publish / Draft</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Change Blog Order</span>
                    </div>
                  </motion.div>

                  {/* Option 3: Product Management */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col h-full group"
                    onClick={() => setCurrentView('products')}
                  >
                    <div className="w-14 h-14 bg-emerald-50 text-[#064e3b] rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-[#064e3b] group-hover:text-white transition-colors">
                      <ShoppingCart className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                      🛒 Product Management
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed flex-1">
                      Manage product catalog images and upload real product photographs for SGB SIDE PACK BRUSH CUTTER TROLLEY.
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Upload Product Images</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Brush Cutter Trolley</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Zoom & Gallery</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: GALLERY PANEL */}
            {currentView === 'gallery' && (
              <motion.div
                key="gallery-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col flex-1 overflow-hidden bg-slate-50/50"
              >
                {/* Header Actions / Navigation */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">🖼️ Gallery Album Management</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Create, edit and manage professional multi-image gallery albums.</p>
                  </div>

                  {albumViewMode === 'list' && (
                    <button
                      onClick={() => {
                        setNewAlbumTitle('');
                        setNewAlbumDesc('');
                        setNewAlbumMedia([]);
                        setAlbumViewMode('create');
                      }}
                      className="px-4 py-2 bg-[#064e3b] text-white rounded-xl text-xs font-bold transition-all hover:bg-[#16a34a] shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Gallery Album</span>
                    </button>
                  )}
                </div>

                {/* Main panel body */}
                <div className="p-6 overflow-y-auto flex-1">
                  {albumViewMode === 'list' ? (
                    /* ALBUMS LIST VIEW */
                    <div className="space-y-6">
                      {albums.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-xl mx-auto shadow-sm">
                          <div className="w-16 h-16 bg-emerald-50 text-[#16a34a] rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                          <h4 className="text-base font-bold text-slate-700">No gallery albums created yet</h4>
                          <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                            Every item in your public website gallery resides in an album. Create your first album to show files to visitors.
                          </p>
                          <button
                            onClick={() => {
                              setNewAlbumTitle('');
                              setNewAlbumDesc('');
                              setNewAlbumMedia([]);
                              setAlbumViewMode('create');
                            }}
                            className="mt-5 px-5 py-2.5 bg-[#064e3b] text-white rounded-xl text-xs font-bold hover:bg-[#16a34a] transition-colors shadow-sm inline-flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" /> Create Album
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {albums.map((album) => {
                            const imagesCount = album.media ? album.media.filter((m) => m.type === 'image').length : 0;
                            const videosCount = album.media ? album.media.filter((m) => m.type === 'video').length : 0;
                            const coverImg = album.coverImageUrl || (album.media && album.media.length > 0 ? album.media[0].url : '');

                            return (
                              <div
                                key={album.id}
                                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
                              >
                                <div>
                                  {/* Album Thumbnail */}
                                  <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-200 relative">
                                    {coverImg ? (
                                      <img src={coverImg} alt={album.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                                        <ImageIcon className="w-8 h-8" />
                                        <span className="text-[10px] font-bold">No Cover Image</span>
                                      </div>
                                    )}
                                    {/* Badges overlay */}
                                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                                      <span className="bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                        📷 {imagesCount}
                                      </span>
                                      {videosCount > 0 && (
                                        <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                          ▶ {videosCount}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#16a34a] transition-colors truncate">
                                    {album.title}
                                  </h4>
                                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[2rem]">
                                    {album.description || 'No description provided.'}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-medium">
                                    📅 Created: {new Date(album.uploadDate).toLocaleDateString()}
                                  </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                  <button
                                    onClick={() => handleStartEditAlbum(album)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    <span>Manage Album</span>
                                  </button>

                                  <button
                                    onClick={() => handleDeleteAlbumEntirely(album.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete entire album"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : albumViewMode === 'create' ? (
                    /* CREATE ALBUM VIEW */
                    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <button
                          onClick={() => setAlbumViewMode('list')}
                          className="text-xs font-bold text-[#064e3b] hover:text-[#16a34a] flex items-center gap-1 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Album List</span>
                        </button>
                        <span className="text-xs font-bold text-slate-400">Step 1 of 1</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Album Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Field Machinery Showcase, Irrigation Installation..."
                            value={newAlbumTitle}
                            onChange={(e) => setNewAlbumTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a] text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Album Description (Optional)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Provide a description of this album, visible to gallery visitors."
                            value={newAlbumDesc}
                            onChange={(e) => setNewAlbumDesc(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a] text-slate-800"
                          />
                        </div>

                        {/* Multi Media Upload Area */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Upload Album Media (Photos and Videos) <span className="text-red-500">*</span>
                          </label>
                          <div className="border-2 border-dashed border-slate-200 hover:border-[#16a34a] bg-slate-50/50 rounded-2xl p-6 text-center transition-all">
                            <input
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              onChange={(e) => {
                                if (e.target.files) {
                                  handleCreateAlbumFilesSelect(Array.from(e.target.files));
                                }
                              }}
                              className="hidden"
                              id="album-file-input"
                            />
                            <label
                              htmlFor="album-file-input"
                              className="cursor-pointer flex flex-col items-center justify-center gap-2"
                            >
                              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center">
                                <Upload className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-bold text-slate-800">Select Multiple Images & Videos</span>
                              <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP, MP4, MOV, WEBM</span>
                            </label>
                          </div>
                        </div>

                        {/* Media items selected preview */}
                        {newAlbumMedia.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700">Selected Media Items ({newAlbumMedia.length})</span>
                              <button
                                onClick={() => setNewAlbumMedia([])}
                                className="text-[10px] text-red-600 hover:underline font-bold"
                              >
                                Clear All
                              </button>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                              {newAlbumMedia.map((item, idx) => (
                                <div key={item.id} className="aspect-square bg-slate-900 rounded-lg overflow-hidden relative group border border-slate-200">
                                  {item.type === 'video' ? (
                                    <video src={item.url} className="w-full h-full object-cover" />
                                  ) : (
                                    <img src={item.url} className="w-full h-full object-cover" />
                                  )}
                                  <button
                                    onClick={() => setNewAlbumMedia(newAlbumMedia.filter(m => m.id !== item.id))}
                                    className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform scale-75 shadow-md shadow-red-950/20"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                  {item.type === 'video' && (
                                    <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/70 rounded text-[8px] font-bold text-white uppercase">
                                      Video
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {albumUploading && (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            <span>Processing selected media assets...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setAlbumViewMode('list')}
                          className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-bold transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={albumUploading || !newAlbumTitle.trim()}
                          onClick={handleCreateAlbum}
                          className="px-5 py-2.5 bg-[#064e3b] hover:bg-[#16a34a] text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                        >
                          Publish Album
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* EDIT / MANAGE ALBUM VIEW */
                    selectedAlbumForEdit && (
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
                        {/* Meta and Navigation */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
                          <button
                            onClick={() => {
                              setSelectedAlbumForEdit(null);
                              setAlbumViewMode('list');
                            }}
                            className="text-xs font-bold text-[#064e3b] hover:text-[#16a34a] flex items-center gap-1 transition-colors self-start"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Album List</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAlbumEntirely(selectedAlbumForEdit.id)}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start animate-pulse"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Entire Album</span>
                          </button>
                        </div>

                        {/* Title and Description Editing Fields */}
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 space-y-4">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            📝 Album Details
                          </h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Album Title *</label>
                              <input
                                type="text"
                                value={editAlbumTitle}
                                onChange={(e) => setEditAlbumTitle(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a] bg-white text-slate-800 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Album Description (Optional)</label>
                              <textarea
                                value={editAlbumDesc}
                                rows={2}
                                onChange={(e) => setEditAlbumDesc(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a] bg-white text-slate-800"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end pt-2">
                            <button
                              onClick={handleSaveAlbumMeta}
                              className="px-4 py-2 bg-[#064e3b] hover:bg-[#16a34a] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Details</span>
                            </button>
                          </div>
                        </div>

                        {/* Upload Add More Media */}
                        <div className="bg-emerald-50/20 p-5 rounded-2xl border border-emerald-100/80 space-y-3">
                          <h4 className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            <span>Add More Media to Album</span>
                          </h4>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              onChange={(e) => {
                                if (e.target.files) {
                                  handleAddMoreMediaToAlbum(Array.from(e.target.files));
                                }
                              }}
                              className="hidden"
                              id="edit-album-add-more"
                            />
                            <label
                              htmlFor="edit-album-add-more"
                              className="px-4 py-2.5 bg-white border border-emerald-200 hover:bg-emerald-50 text-[#064e3b] text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#16a34a]" />
                              <span>Select Images / Videos</span>
                            </label>
                            <span className="text-[10px] text-slate-500">
                              Directly appends files to this album.
                            </span>
                          </div>

                          {albumUploading && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                              <span>Processing & adding new media files...</span>
                            </div>
                          )}
                        </div>

                        {/* Media list & Grid with Reordering, Covers, Deleting */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              🖼️ Media Files inside Album ({selectedAlbumForEdit.media ? selectedAlbumForEdit.media.length : 0})
                            </h4>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Use Arrows to reorder. Set Covers with Star.
                            </span>
                          </div>

                          {!selectedAlbumForEdit.media || selectedAlbumForEdit.media.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                              <span className="text-xs text-slate-500">No media uploaded in this album yet. Add some above!</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selectedAlbumForEdit.media
                                .sort((a, b) => a.order - b.order)
                                .map((item, index) => {
                                  const isCover = selectedAlbumForEdit.coverImageUrl === item.url || (!selectedAlbumForEdit.coverImageUrl && index === 0);

                                  return (
                                    <div
                                      key={item.id}
                                      className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-start gap-3 hover:border-slate-300 transition-all"
                                    >
                                      {/* Thumbnail */}
                                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0 relative border border-slate-100">
                                        {item.type === 'video' ? (
                                          <video src={item.url} className="w-full h-full object-cover" />
                                        ) : (
                                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                                        )}
                                        {item.type === 'video' && (
                                          <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/70 rounded text-[7px] font-bold text-white uppercase tracking-wider">
                                            Video
                                          </span>
                                        )}
                                      </div>

                                      {/* Info and action */}
                                      <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                                        <div className="flex items-start justify-between gap-1">
                                          <span className="text-[10px] font-semibold text-slate-600 truncate block">
                                            {item.caption || `Media File #${index + 1}`}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 mt-auto">
                                          {/* Move Up */}
                                          <button
                                            disabled={index === 0}
                                            onClick={() => handleMoveAlbumItem(index, 'up')}
                                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                                            title="Move Up"
                                          >
                                            <ArrowUp className="w-3.5 h-3.5" />
                                          </button>

                                          {/* Move Down */}
                                          <button
                                            disabled={index === (selectedAlbumForEdit.media ? selectedAlbumForEdit.media.length - 1 : 0)}
                                            onClick={() => handleMoveAlbumItem(index, 'down')}
                                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                                            title="Move Down"
                                          >
                                            <ArrowDown className="w-3.5 h-3.5" />
                                          </button>

                                          {/* Set as Cover */}
                                          <button
                                            onClick={() => handleSetAlbumCover(item.url)}
                                            className={`px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 transition-all ${
                                              isCover
                                                ? 'bg-amber-100 border border-amber-300 text-amber-800'
                                                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                                            }`}
                                            title={isCover ? 'Currently Cover Image' : 'Set as Album Cover'}
                                          >
                                            <Star className={`w-3 h-3 ${isCover ? 'fill-amber-500 text-amber-500' : ''}`} />
                                            <span>{isCover ? 'Cover' : 'Make Cover'}</span>
                                          </button>

                                          {/* Delete Individual */}
                                          <button
                                            onClick={() => handleDeleteAlbumItem(item.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded ml-auto transition-colors"
                                            title="Delete individual item"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW 3: BLOG PANEL */}
            {currentView === 'blog' && (
              <motion.div
                key="blog-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Blog Tabs */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-3">
                  <button
                    onClick={() => setBlogActiveTab('upload')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      blogActiveTab === 'upload'
                        ? 'bg-[#064e3b] text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload HTML Blog</span>
                  </button>

                  <button
                    onClick={() => setBlogActiveTab('manage')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      blogActiveTab === 'manage'
                        ? 'bg-[#064e3b] text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Manage Blogs ({blogs.length})</span>
                  </button>
                </div>

                {/* Blog Tab Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                  {blogActiveTab === 'upload' ? (
                    <div className="space-y-6 max-w-3xl mx-auto">
                      
                      {/* Upload Box */}
                      <div
                        onDragEnter={handleBlogDrag}
                        onDragOver={handleBlogDrag}
                        onDragLeave={handleBlogDrag}
                        onDrop={handleBlogDrop}
                        onClick={() => blogFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                          blogDragActive
                            ? 'border-[#16a34a] bg-emerald-50/50 scale-[1.01]'
                            : 'border-slate-300 bg-white hover:border-[#16a34a] hover:bg-slate-50'
                        }`}
                      >
                        <input
                          ref={blogFileInputRef}
                          type="file"
                          accept=".html"
                          onChange={handleBlogFileInput}
                          className="hidden"
                        />

                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#064e3b] flex items-center justify-center mx-auto mb-4">
                          <FileCode className="w-8 h-8 text-[#16a34a]" />
                        </div>

                        <h4 className="text-base font-bold text-slate-800">
                          Upload Complete HTML Blog File
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Drag and drop your .html file here, or click to browse
                        </p>

                        <div className="mt-3">
                          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                            Supports .HTML extension only
                          </span>
                        </div>
                      </div>

                      {blogUploading && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                          <span>Parsing HTML details...</span>
                        </div>
                      )}

                      {blogUploadSuccess && (
                        <div className="p-4 rounded-2xl bg-green-100 border border-green-300 text-green-800 text-xs font-medium space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <Check className="w-4 h-4 text-green-700" />
                            <span>HTML Parsed Successfully!</span>
                          </div>
                          <p className="text-green-700 text-[11px] leading-relaxed">
                            {blogUploadSuccess}
                          </p>
                        </div>
                      )}

                      {/* Extracted Meta review & adjustments */}
                      {blogHtmlContent && (
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            Extracted Publication Information
                          </h3>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">
                                Blog Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Edit title if needed..."
                                value={blogTitle}
                                onChange={(e) => setBlogTitle(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#16a34a]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1">
                                Short Description (Auto-extracted)
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Edit short summary..."
                                value={blogShortDescription}
                                onChange={(e) => setBlogShortDescription(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a] leading-relaxed"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">
                                  Featured Image URL / Path (First Detected)
                                </label>
                                <input
                                  type="text"
                                  placeholder="Image path or base64..."
                                  value={blogFeaturedImage}
                                  onChange={(e) => setBlogFeaturedImage(e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a]"
                                />
                              </div>

                              <div className="flex flex-col justify-end pb-1.5">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="blogPublished"
                                    checked={blogIsPublished}
                                    onChange={(e) => setBlogIsPublished(e.target.checked)}
                                    className="rounded border-slate-300 text-[#16a34a] focus:ring-[#16a34a]"
                                  />
                                  <label htmlFor="blogPublished" className="text-xs font-bold text-slate-700 cursor-pointer">
                                    Publish Immediately to Website
                                  </label>
                                </div>
                              </div>
                            </div>

                            {blogFeaturedImage && (
                              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                <img
                                  src={blogFeaturedImage}
                                  alt="Featured preview"
                                  referrerPolicy="no-referrer"
                                  className="w-16 h-12 object-cover rounded-lg bg-slate-200 border border-slate-200"
                                />
                                <div className="text-[10px] text-slate-500">
                                  <span className="font-bold text-slate-700 block">Featured Image Detected</span>
                                  Using the first visual element from the HTML as card banner.
                                </div>
                              </div>
                            )}

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setBlogHtmlContent('');
                                  setBlogUploadSuccess(null);
                                }}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                              >
                                Discard
                              </button>
                              <button
                                onClick={handleSaveNewBlog}
                                className="px-5 py-2.5 bg-[#064e3b] hover:bg-[#16a34a] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-green-950/20"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save & Publish Blog</span>
                              </button>
                            </div>

                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    /* Manage Blogs List */
                    <div>
                      {blogs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                            <BookOpen className="w-8 h-8" />
                          </div>
                          <h4 className="text-base font-bold text-slate-700">No blog articles have been uploaded yet</h4>
                          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            Switch to the "Upload HTML Blog" tab to parse and publish your first article guidelines.
                          </p>
                          <button
                            onClick={() => setBlogActiveTab('upload')}
                            className="mt-4 px-5 py-2.5 bg-[#064e3b] text-white rounded-xl text-xs font-bold hover:bg-[#16a34a] transition-colors"
                          >
                            Upload HTML Now
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-xs text-slate-500">
                            Drag or move articles to adjust presentation order, toggle publishing visibility, preview live render, or delete.
                          </p>

                          <div className="space-y-3">
                            {blogs.map((blog, index) => (
                              <div
                                key={blog.id}
                                className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${
                                  !blog.published ? 'opacity-65 border-slate-200 bg-slate-50/50' : 'border-slate-200'
                                }`}
                              >
                                {/* Mini Banner Preview */}
                                <div
                                  onClick={() => setPreviewBlog(blog)}
                                  className="w-20 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 relative cursor-pointer group border border-slate-100"
                                >
                                  {blog.featuredImage ? (
                                    <img src={blog.featuredImage} alt={blog.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-[#064e3b] flex items-center justify-center">
                                      <BookOpen className="w-5 h-5 text-emerald-300" />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <Eye className="w-4 h-4" />
                                  </div>
                                </div>

                                {/* Main Title & Description */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-slate-900 truncate">
                                      {blog.title || 'Untitled Article'}
                                    </h4>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                                      blog.published
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-amber-50 border-amber-200 text-amber-700'
                                    }`}>
                                      {blog.published ? 'PUBLISHED' : 'DRAFT'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                    {blog.shortDescription}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    Published: {new Date(blog.uploadDate).toLocaleDateString()}
                                  </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end sm:border-l sm:border-slate-100 sm:pl-4 mt-2 sm:mt-0 pt-2 sm:pt-0">
                                  {/* Reorder up/down */}
                                  <button
                                    disabled={index === 0}
                                    onClick={() => handleMoveBlog(index, 'up')}
                                    title="Move Up"
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    disabled={index === blogs.length - 1}
                                    onClick={() => handleMoveBlog(index, 'down')}
                                    title="Move Down"
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Toggle Publish */}
                                  <button
                                    onClick={() => handleTogglePublish(blog)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border ${
                                      blog.published
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                        : 'bg-amber-50 border-amber-300 text-amber-700'
                                    }`}
                                  >
                                    {blog.published ? (
                                      <>
                                        <Eye className="w-3 h-3" /> Published
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="w-3 h-3" /> Unpublished / Draft
                                      </>
                                    )}
                                  </button>

                                  {/* Edit */}
                                  <button
                                    onClick={() => handleStartEditBlog(blog)}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    title="Edit Meta Info / HTML"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Preview Render */}
                                  <button
                                    onClick={() => setPreviewBlog(blog)}
                                    className="p-1.5 rounded-lg border border-slate-200 text-[#16a34a] hover:bg-emerald-50"
                                    title="Preview Article Layout"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    onClick={() => handleDeleteBlog(blog.id)}
                                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                    title="Delete Blog"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW 4: PRODUCT MANAGEMENT PANEL */}
            {currentView === 'products' && (
              <motion.div
                key="products-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-8"
              >
                <div className="max-w-6xl mx-auto w-full space-y-8">
                  {/* Top Header */}
                  <div className="bg-gradient-to-r from-[#064e3b] via-emerald-800 to-[#064e3b] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-600/30">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-400/30">
                        <ShoppingCart className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Product Management Center</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Product Catalog & Image Controls
                      </h3>
                      <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl">
                        Upload real photographs for each individual product. Reorder main images and thumbnails, then click Save Changes to publish.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={loadAllProductImages}
                        className="px-4 py-2.5 bg-emerald-700/60 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all border border-emerald-500/30 flex items-center gap-2"
                        title="Reload latest product data"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Reload All</span>
                      </button>
                    </div>
                  </div>

                  {/* Hidden Shared File Input */}
                  <input
                    type="file"
                    ref={productFileInputRef}
                    onChange={handleProductFilesSelected}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  {/* All Product Cards Grid */}
                  <div className="space-y-8">
                    {PRODUCTS.map((prod) => {
                      const images = draftProductImages[prod.id] || (prod.images && prod.images.length > 0 ? prod.images : [prod.image]);
                      const mainImg = images[0] || prod.image;
                      const isCustom = getCustomProductImages(prod.id) !== null;

                      return (
                        <div
                          key={prod.id}
                          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md transition-all hover:shadow-lg relative overflow-hidden"
                        >
                          {/* Top Product Meta Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  {prod.category}
                                </span>
                                <span className="text-xs font-bold text-slate-400">SKU: {prod.sku || prod.id}</span>
                              </div>
                              <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {prod.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-3">
                              {isCustom ? (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Custom Images Active</span>
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                                  Default Graphic
                                </span>
                              )}
                              <span className="text-lg font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100">
                                {prod.price}
                              </span>
                            </div>
                          </div>

                          {/* Card Main Body */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Main Product Image Preview */}
                            <div className="lg:col-span-5 flex flex-col gap-3">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                Main Product Image (Zoom on Hover)
                              </span>
                              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner group flex items-center justify-center p-4">
                                <img
                                  src={mainImg}
                                  alt={prod.title}
                                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                  <Eye className="w-3 h-3 text-emerald-400" /> Hover to Zoom
                                </div>
                              </div>
                            </div>

                            {/* Gallery & Actions */}
                            <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Gallery Thumbnails ({images.length})
                                  </span>
                                  <span className="text-[11px] text-slate-400">First image is the Main Image</span>
                                </div>

                                {/* Thumbnails List */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1 scrollbar-thin">
                                  {images.map((imgUrl, imgIdx) => (
                                    <div
                                      key={imgIdx}
                                      className={`relative rounded-xl border-2 overflow-hidden bg-slate-50 group flex flex-col items-center justify-center p-2 transition-all ${
                                        imgIdx === 0
                                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                                          : 'border-slate-200 hover:border-slate-300'
                                      }`}
                                    >
                                      <div className="w-full h-20 sm:h-24 flex items-center justify-center overflow-hidden">
                                        <img src={imgUrl} alt={`Thumb ${imgIdx + 1}`} className="max-h-full max-w-full object-contain" />
                                      </div>

                                      {/* Main Badge */}
                                      {imgIdx === 0 && (
                                        <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                                          MAIN
                                        </span>
                                      )}

                                      {/* Thumbnail Controls Overlay */}
                                      <div className="absolute inset-0 bg-slate-900/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-1 text-white">
                                        {imgIdx !== 0 && (
                                          <button
                                            onClick={() => handleSetMainImage(prod.id, imgIdx)}
                                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-[10px] font-bold shadow-xs w-full text-center"
                                            title="Set as main image"
                                          >
                                            Set Main
                                          </button>
                                        )}

                                        <div className="flex items-center gap-1 w-full justify-center mt-1">
                                          {imgIdx > 0 && (
                                            <button
                                              onClick={() => handleMoveProductImage(prod.id, imgIdx, 'left')}
                                              className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-xs"
                                              title="Move left"
                                            >
                                              ←
                                            </button>
                                          )}
                                          {imgIdx < images.length - 1 && (
                                            <button
                                              onClick={() => handleMoveProductImage(prod.id, imgIdx, 'right')}
                                              className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-xs"
                                            >
                                              →
                                            </button>
                                          )}
                                          <button
                                            onClick={() => handleRemoveProductImage(prod.id, imgIdx)}
                                            className="p-1 bg-red-600 hover:bg-red-500 rounded text-xs"
                                            title="Remove image"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Card Bottom Action Bar */}
                              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  {/* Upload Images Button */}
                                  <button
                                    onClick={() => triggerUploadForProduct(prod.id)}
                                    className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer border border-slate-700"
                                  >
                                    <Upload className="w-4 h-4 text-emerald-400" />
                                    <span>Upload Images</span>
                                  </button>

                                  {isCustom && (
                                    <button
                                      onClick={() => handleResetProductToDefault(prod)}
                                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                                      title="Reset to default system graphic"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                      <span>Reset</span>
                                    </button>
                                  )}
                                </div>

                                {/* Save Changes Button */}
                                <button
                                  onClick={() => handleSaveChangesForProduct(prod)}
                                  className="py-2.5 px-6 bg-[#064e3b] hover:bg-[#16a34a] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-emerald-500/30"
                                >
                                  <Save className="w-4 h-4 text-amber-300" />
                                  <span>Save Changes</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ==========================================
            EDIT GALLERY ITEM MODAL
        ========================================== */}
        {editingItem && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative">
              <button
                onClick={() => setEditingItem(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-800">Edit Media Information</h3>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Caption</label>
                <textarea
                  rows={3}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editFeatured"
                  checked={editFeatured}
                  onChange={(e) => setEditFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-[#16a34a]"
                />
                <label htmlFor="editFeatured" className="text-xs font-semibold text-slate-700">
                  Mark as Featured
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2 bg-[#064e3b] text-white rounded-xl text-xs font-bold hover:bg-[#16a34a]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            EDIT BLOG ITEM MODAL
        ========================================== */}
        {editingBlog && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 relative my-6">
              <button
                onClick={() => setEditingBlog(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-[#064e3b] border-b border-slate-100 pb-2">Edit Blog Publication Meta</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={editBlogTitle}
                    onChange={(e) => setEditBlogTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Short Description</label>
                  <textarea
                    rows={3}
                    value={editBlogShortDescription}
                    onChange={(e) => setEditBlogShortDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Featured Image URL / Path</label>
                  <input
                    type="text"
                    value={editBlogFeaturedImage}
                    onChange={(e) => setEditBlogFeaturedImage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">HTML Content Markup</label>
                  <textarea
                    rows={8}
                    value={editBlogContent}
                    onChange={(e) => setEditBlogContent(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#16a34a] bg-slate-50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editBlogPublished"
                    checked={editBlogPublished}
                    onChange={(e) => setEditBlogPublished(e.target.checked)}
                    className="rounded border-slate-300 text-[#16a34a]"
                  />
                  <label htmlFor="editBlogPublished" className="text-xs font-bold text-slate-700">
                    Publish immediately on live blog section
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBlogEdit}
                  className="px-5 py-2.5 bg-[#064e3b] text-white rounded-xl text-xs font-bold hover:bg-[#16a34a] flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Updates</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            PREVIEW GALLERY MEDIA MODAL
        ========================================== */}
        {previewMedia && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full flex flex-col items-center relative">
              <button
                onClick={() => setPreviewMedia(null)}
                className="absolute -top-10 right-0 text-white hover:text-emerald-400 p-2"
              >
                <X className="w-6 h-6" />
              </button>

              {previewMedia.type === 'video' ? (
                <video src={previewMedia.url} controls autoPlay className="max-h-[75vh] w-auto rounded-2xl shadow-2xl" />
              ) : (
                <img src={previewMedia.url} alt={previewMedia.title} className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl" />
              )}

              <div className="mt-3 text-center text-white">
                <h3 className="text-lg font-bold">{previewMedia.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{previewMedia.caption}</p>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            PREVIEW BLOG RENDER MODAL
        ========================================== */}
        {previewBlog && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-50 rounded-[2rem] max-w-4xl w-full my-6 overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] shadow-2xl relative">
              
              {/* Header Info */}
              <div className="bg-[#064e3b] text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900/50">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-emerald-500/30 text-emerald-300 rounded-full">
                    Layout Preview Mode
                  </span>
                  <span className="text-xs text-emerald-100 italic">This shows how visitors will see the publication</span>
                </div>
                <button
                  onClick={() => setPreviewBlog(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Parsed Blog Viewer Content */}
              <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-6">
                <div className="max-w-3xl mx-auto space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/60 shadow-lg">
                  <div>
                    <span className="text-xs font-bold text-[#16a34a] uppercase tracking-widest block mb-2">
                      Farming Guidelines
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#064e3b] tracking-tight leading-tight">
                      {previewBlog.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2">
                      Uploaded on {new Date(previewBlog.uploadDate).toLocaleDateString()} • Published status: {previewBlog.published ? 'Live' : 'Draft'}
                    </p>
                  </div>

                  {previewBlog.featuredImage && (
                    <div className="w-full max-h-80 overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                      <img src={previewBlog.featuredImage} alt="Featured cover" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-6">
                    <div
                      className="preview-blog-content text-slate-700 leading-relaxed text-sm sm:text-base space-y-4"
                      dangerouslySetInnerHTML={{ __html: previewBlog.content }}
                    />
                    
                    {/* Render style scope */}
                    <style>{`
                      .preview-blog-content h1 {
                        font-size: 1.5rem;
                        font-weight: 800;
                        color: #064e3b;
                        margin-top: 1.5rem;
                        margin-bottom: 0.75rem;
                      }
                      .preview-blog-content h2 {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #064e3b;
                        margin-top: 1.25rem;
                        margin-bottom: 0.5rem;
                      }
                      .preview-blog-content p {
                        margin-bottom: 1rem;
                        color: #4b5563;
                      }
                      .preview-blog-content ul {
                        list-style-type: disc;
                        padding-left: 1.25rem;
                        margin-bottom: 1rem;
                      }
                      .preview-blog-content ol {
                        list-style-type: decimal;
                        padding-left: 1.25rem;
                        margin-bottom: 1rem;
                      }
                      .preview-blog-content img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 0.75rem;
                        margin: 1.5rem auto;
                        display: block;
                      }
                      .preview-blog-content iframe {
                        max-width: 100%;
                        aspect-ratio: 16/9;
                        border-radius: 0.75rem;
                        margin: 1.5rem auto;
                        display: block;
                        border: none;
                      }
                    `}</style>
                  </div>
                </div>
              </div>

              {/* Close Bottom Area */}
              <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setPreviewBlog(null)}
                  className="px-5 py-2 bg-[#064e3b] text-white rounded-xl text-xs font-bold hover:bg-[#16a34a]"
                >
                  Close Preview
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            DELETE CONFIRMATION DIALOG MODAL
        ========================================== */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-center"
            >
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">Are you sure you want to delete this file?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This action cannot be undone. All associated content and data will be permanently removed from our storage and databases.
                </p>
              </div>

              <div className="flex items-center gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm({ show: false, type: 'gallery', id: '' })}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-200 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ==========================================
            NOTIFICATION POPUP / TOAST
        ========================================== */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-[110]">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {notification.type === 'success' ? (
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">!</div>
              )}
              <span className="text-xs font-bold">{notification.message}</span>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
