import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getAllAlbums } from '../lib/galleryStore';
import { GalleryAlbum, AlbumMediaItem } from '../types';
import {
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Film,
  Image as ImageIcon,
  Upload,
  Lock,
  FolderOpen,
  ArrowLeft,
  Calendar,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface GallerySectionProps {
  onOpenAdminLogin?: () => void;
  refreshTrigger?: number;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  onOpenAdminLogin,
  refreshTrigger = 0,
}) => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [loading, setLoading] = useState(true);

  // Selected item index within the active album for the Lightbox
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  // Lightbox zoom status
  const [isZoomed, setIsZoomed] = useState(false);

  const loadAlbums = async () => {
    setLoading(true);
    const fetched = await getAllAlbums();
    setAlbums(fetched);
    setLoading(false);
  };

  useEffect(() => {
    loadAlbums();
  }, [refreshTrigger]);

  const handleNext = () => {
    if (selectedAlbum === null || selectedItemIndex === null) return;
    setIsZoomed(false); // Reset zoom on navigate
    setSelectedItemIndex((selectedItemIndex + 1) % selectedAlbum.media.length);
  };

  const handlePrev = () => {
    if (selectedAlbum === null || selectedItemIndex === null) return;
    setIsZoomed(false); // Reset zoom on navigate
    setSelectedItemIndex((selectedItemIndex - 1 + selectedAlbum.media.length) % selectedAlbum.media.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedItemIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        setSelectedItemIndex(null);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItemIndex, selectedAlbum]);

  return (
    <section id="gallery" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-green-100 text-[#064e3b] rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-green-200"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#16a34a]"></span>
            Dynamic Media • Field Showcase
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-[#064e3b] tracking-tight leading-tight"
          >
            Project & <span className="font-serif italic font-medium text-[#16a34a]">Media</span> Gallery
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            Explore actual videos and photos of SGB AGRO INDUSTRIES machinery in action across farms and plantations.
          </motion.p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#16a34a] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold">Loading media gallery...</p>
          </div>
        ) : selectedAlbum === null ? (
          /* ALBUMS GRID VIEW (No album is selected) */
          <div>
            {albums.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto text-center py-16 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-[#064e3b] shadow-inner">
                  <Upload className="w-10 h-10 text-[#16a34a]" />
                </div>

                <h3 className="text-xl font-bold text-slate-800">
                  No gallery images or videos have been uploaded yet.
                </h3>

                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                  Photos and videos of manufacturing, field operations, and installations will appear here once uploaded.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album) => {
                  const imagesCount = album.media ? album.media.filter((m) => m.type === 'image').length : 0;
                  const videosCount = album.media ? album.media.filter((m) => m.type === 'video').length : 0;
                  const coverImg = album.coverImageUrl || (album.media && album.media.length > 0 ? album.media[0].url : '');

                  return (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => {
                        setSelectedAlbum(album);
                        setSelectedItemIndex(null);
                      }}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group"
                    >
                      {/* Cover Thumbnail */}
                      <div className="h-56 w-full overflow-hidden bg-slate-100 relative">
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 gap-2">
                            <FolderOpen className="w-10 h-10 text-slate-300" />
                            <span className="text-xs font-bold text-slate-400">Empty Album</span>
                          </div>
                        )}

                        {/* Top badges overlay */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                            📷 {imagesCount} {imagesCount === 1 ? 'Photo' : 'Photos'}
                          </span>
                          {videosCount > 0 && (
                            <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                              ▶ {videosCount} {videosCount === 1 ? 'Video' : 'Videos'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                            📂 Website Gallery Album
                          </span>
                          <h3 className="text-lg font-bold text-[#064e3b] group-hover:text-[#16a34a] transition-colors line-clamp-1">
                            {album.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed min-h-[3rem]">
                            {album.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                          <span className="text-xs font-bold text-[#064e3b] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            Open Album &rarr;
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* SINGLE ALBUM DETAILED VIEW (Browse inside selected album) */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {/* Header / Back Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
              <div>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#064e3b] text-xs font-bold rounded-xl transition-all mb-4 border border-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Gallery Albums</span>
                </button>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#064e3b]">
                  {selectedAlbum.title}
                </h3>
                {selectedAlbum.description && (
                  <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                    {selectedAlbum.description}
                  </p>
                )}
              </div>

              {/* Quick statistics card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-[200px] shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Album Overview</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-lg font-bold text-slate-800">
                      {selectedAlbum.media ? selectedAlbum.media.filter(m => m.type === 'image').length : 0}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold uppercase">Photos</span>
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-slate-800">
                      {selectedAlbum.media ? selectedAlbum.media.filter(m => m.type === 'video').length : 0}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold uppercase">Videos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* If album is empty */}
            {!selectedAlbum.media || selectedAlbum.media.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-3xl">
                <p className="text-slate-500 text-sm">This album has no media content yet.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Images grid section */}
                {selectedAlbum.media.some(m => m.type === 'image') && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" /> Photo Showcase
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedAlbum.media
                        .map((item, idx) => ({ item, originalIndex: idx }))
                        .filter(({ item }) => item.type === 'image')
                        .sort((a, b) => a.item.order - b.item.order)
                        .map(({ item, originalIndex }) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedItemIndex(originalIndex)}
                            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-200 shadow-md transition-all duration-300"
                          >
                            <img
                              src={item.url}
                              alt={item.caption || selectedAlbum.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />

                            {/* Black gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />

                            <div className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-105">
                              <Maximize2 className="w-4 h-4" />
                            </div>

                            {item.caption && (
                              <div className="absolute bottom-4 left-4 right-4 text-white">
                                <p className="text-xs font-bold truncate">{item.caption}</p>
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Videos grid section */}
                {selectedAlbum.media.some(m => m.type === 'video') && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Operational & Demo Videos
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedAlbum.media
                        .map((item, idx) => ({ item, originalIndex: idx }))
                        .filter(({ item }) => item.type === 'video')
                        .sort((a, b) => a.item.order - b.item.order)
                        .map(({ item, originalIndex }) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedItemIndex(originalIndex)}
                            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-200 shadow-md transition-all duration-300"
                          >
                            <div className="w-full h-full relative">
                              <video src={item.url} className="w-full h-full object-cover" muted />
                              <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-blue-900 shadow-xl group-hover:scale-110 transition-transform">
                                  <Play className="w-6 h-6 fill-blue-900 ml-1" />
                                </div>
                              </div>
                            </div>

                            <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                              <Film className="w-3 h-3" /> Video
                            </div>

                            {item.caption && (
                              <div className="absolute bottom-4 left-4 right-4 text-white">
                                <p className="text-xs font-bold truncate">{item.caption}</p>
                              </div>
                            )}
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Lightbox / Video Popup Modal */}
      <AnimatePresence>
        {selectedItemIndex !== null && selectedAlbum && selectedAlbum.media[selectedItemIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-md">
            {/* Top Bar Stats & Controls */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-white z-20">
              <span className="text-xs font-bold text-slate-400">
                Item {selectedItemIndex + 1} of {selectedAlbum.media.length} &bull; {selectedAlbum.title}
              </span>

              <div className="flex items-center gap-3">
                {selectedAlbum.media[selectedItemIndex].type === 'image' && (
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                    title={isZoomed ? "Zoom Out" : "Zoom In"}
                  >
                    {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedItemIndex(null);
                    setIsZoomed(false);
                  }}
                  className="p-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                  title="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation arrows */}
            {selectedAlbum.media.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 hover:scale-105 transition-all z-20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 hover:scale-105 transition-all z-20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Secure Container for Image / Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full flex flex-col items-center justify-center p-4"
            >
              <div className="relative overflow-hidden rounded-2xl bg-black/50 max-h-[70vh] flex items-center justify-center">
                {selectedAlbum.media[selectedItemIndex].type === 'video' ? (
                  <video
                    src={selectedAlbum.media[selectedItemIndex].url}
                    controls
                    autoPlay
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="max-h-[70vh] w-full rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div className="overflow-auto max-h-[70vh] flex items-center justify-center">
                    <img
                      src={selectedAlbum.media[selectedItemIndex].url}
                      alt={selectedAlbum.media[selectedItemIndex].caption || selectedAlbum.title}
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                      onClick={() => setIsZoomed(!isZoomed)}
                      className={`max-h-[70vh] w-auto object-contain transition-all duration-300 select-none ${
                        isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Caption details box */}
              <div className="mt-4 text-center text-white max-w-xl">
                <h3 className="text-lg font-bold text-emerald-400">
                  {selectedAlbum.media[selectedItemIndex].caption || selectedAlbum.title}
                </h3>
                {selectedAlbum.media[selectedItemIndex].caption && (
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                    Gallery Asset inside {selectedAlbum.title}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
