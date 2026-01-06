import React, { useEffect, useState } from 'react';
import { THEME } from './constants';
import LinkTree from './components/LinkTree';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { useContent } from './context/ContentContext';
import { Upload, Loader2, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { sheetApi } from './services/sheetApi';

// Helper to get youtube embed url
const getEmbedUrl = (url: string) => {
    try {
        if (!url) return '';
        if (url.includes('embed')) {
            // Ensure we strip existing query params to avoid double ?
            return url.split('?')[0];
        }
        
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be')) {
            videoId = url.split('/').pop()?.split('?')[0] || '';
        } else if (url.includes('shorts/')) {
            videoId = url.split('shorts/')[1]?.split('?')[0] || '';
        }
        
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        return url;
    } catch {
        return url;
    }
}

// Helper to convert Drive View links to Direct Download links for <video>/<img> tags
const getDirectUrl = (url: string) => {
    if (!url) return '';
    try {
        // If it's a Google Drive link
        if (url.includes('drive.google.com')) {
            // Check for /file/d/ID pattern
            const idMatch = url.match(/\/d\/([^/]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
            }
            // Check for id=ID pattern
            const idParamMatch = url.match(/id=([^&]+)/);
            if (idParamMatch && idParamMatch[1]) {
                return `https://drive.google.com/uc?export=download&id=${idParamMatch[1]}`;
            }
        }
        return url;
    } catch {
        return url;
    }
};

const SkeletonLoader: React.FC = () => (
    <div className="w-full space-y-10 animate-pulse">
        {/* Header Section Skeleton */}
        <div className="space-y-6 text-center">
            <div className="w-full aspect-video rounded-xl bg-gray-300/80 border-2 border-black/10"></div>
            
            <div className="bg-white border-2 border-gray-200 p-4 rounded-xl space-y-4">
                <div className="h-8 w-3/4 mx-auto bg-gray-300 rounded"></div>
                <div className="h-1 w-20 mx-auto bg-gray-300"></div>
                <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded"></div>
            </div>
        </div>

        {/* Info & Links Skeleton */}
        <div className="space-y-6 flex flex-col items-center">
            <div className="h-8 w-48 bg-gray-300 rounded transform -rotate-1"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>

            <div className="w-full space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 w-full max-w-xs mx-auto bg-gray-300 rounded-full"></div>
                ))}
            </div>
             <div className="flex gap-4 justify-center mt-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gray-300"></div>
                ))}
             </div>
        </div>

         {/* Podcast Skeleton */}
        <div className="pt-6 border-t-4 border-dashed border-gray-300 space-y-4">
             <div className="h-6 w-40 mx-auto bg-gray-300 rounded"></div>
             <div className="w-full aspect-video rounded-xl bg-gray-300/80"></div>
        </div>
    </div>
);

const App: React.FC = () => {
  const { content, isEditing, updateOrganization, updatePodcast, openAuthModal, sessionPassword, toast, hideToast, showToast, isLoadingData } = useContent();
  const [isUploading, setIsUploading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Trigger login if URL contains ?mode=admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
        openAuthModal();
    }
  }, []);

  // Reset video error when header image changes
  useEffect(() => {
    setVideoError(false);
  }, [content.organization.headerImage]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files[0]) return;
      if (!sessionPassword) {
          showToast("Sesi habis, silakan login ulang.", 'warning');
          return;
      }

      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video/');
      const isGif = file.type === 'image/gif';

      if (file.size > 10 * 1024 * 1024) {
          showToast("Ukuran file terlalu besar! Maksimal 10MB.", 'warning');
          return;
      }

      setIsUploading(true);
      showToast(isVideo ? "Mengupload video..." : "Mengupload gambar...", 'info');
      
      try {
          let url = await sheetApi.uploadImage(file, sessionPassword) as string;
          
          // Add #video hash solely for internal identification later
          if (isVideo) {
             url += '#video';
          }
          
          updateOrganization('headerImage', url);
          showToast("Media berhasil diupload & diproses!", 'success');
      } catch (error) {
          console.error("Upload failed", error);
          showToast("Gagal upload media. Coba lagi.", 'error');
      } finally {
          setIsUploading(false);
      }
  };

  const toggleHeaderFormat = (e?: React.MouseEvent) => {
      if (e && typeof e.preventDefault === 'function') {
          e.preventDefault();
      }
      
      const currentUrl = content.organization.headerImage;
      if (currentUrl.includes('#video')) {
          updateOrganization('headerImage', currentUrl.replace('#video', ''));
          showToast("Format diubah ke GAMBAR", 'info');
      } else {
          updateOrganization('headerImage', currentUrl + '#video');
          showToast("Format diubah ke VIDEO", 'info');
      }
  };

  const renderHeaderMedia = () => {
      const rawUrl = content.organization.headerImage;
      if (!rawUrl) {
          return (
            <>
                <div className="text-center opacity-80 z-10">
                    <div className="w-16 h-16 mx-auto bg-purple-600 border-2 border-black rounded-lg mb-2 rotate-3 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">IMG</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Ilustrasi / Video</span>
                </div>
                <div 
                    className="absolute top-0 left-0 w-full h-full opacity-10" 
                    style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                ></div>
            </>
          );
      }

      // Check for YouTube Link in Header
      if (rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be')) {
           const embedUrl = getEmbedUrl(rawUrl);
           // Robustly extract ID for playlist param (essential for looping single video)
           const videoId = embedUrl.split('embed/')[1]?.split('?')[0]; 
           
           // Updated Params:
           // autoplay=1&mute=1 : Forced Autoplay (Muted)
           // controls=0 : Hides player controls for "Background" look
           // loop=1&playlist=[ID] : Loops the single video
           // playsinline=1 : Essential for iOS
           const headerVideoSrc = `${embedUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0`;
           
           return (
              <iframe 
                key={headerVideoSrc} // Force reload when URL changes
                src={headerVideoSrc}
                title="Header Video"
                className="w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                frameBorder="0"
                style={{ pointerEvents: 'none' }} // Re-added pointer-events-none for true background feel, assuming mute=1 works
              />
           );
      }

      // Detect Video Mode
      // If videoError is true, we force it to fall through to Image mode
      // Added (\?|$) regex to handle query params like ?token=xyz
      const isVideo = (rawUrl.includes('#video') || rawUrl.match(/\.(mp4|webm|mov|ogg)(\?|$)/i)) && !videoError;
      const cleanUrl = rawUrl.split('#')[0]; 
      const directUrl = getDirectUrl(cleanUrl); // Convert Drive links to Direct Links

      if (isVideo) {
          return (
              <video 
                key={directUrl} // FORCE RELOAD when URL changes
                src={directUrl} 
                className="w-full h-full object-cover"
                autoPlay 
                loop 
                muted 
                playsInline
                // Removed crossOrigin="anonymous" to prevent CORS errors on public videos (like wordpress uploads)
                onError={() => {
                    // console.warn("Video failed to load, switching to image fallback.");
                    setVideoError(true);
                }}
              />
          );
      }

      // Render Image or GIF
      return (
        <img 
            key={directUrl} 
            src={directUrl} 
            alt="Header" 
            className="w-full h-full object-cover" 
            onError={(e) => {
                // Prevent infinite loop if image also fails
                e.currentTarget.style.display = 'none';
            }}
        />
      );
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-yellow-300 selection:text-black"
      style={{ 
        backgroundColor: '#f0f0f0',
        backgroundImage: `
          linear-gradient(rgba(16, 44, 87, 0.05) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(16, 44, 87, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        color: THEME.colors.textMain
      }}
    >
      <Navbar />
      <AuthModal />
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 space-y-10 pb-24">
        
        {isLoadingData ? (
            <SkeletonLoader />
        ) : (
            <>
                {/* HEADER SECTION */}
                <div className="text-center space-y-6">
                {/* Header Media Container */}
                <div 
                    className="w-full aspect-video rounded-xl overflow-hidden border-2 border-black bg-black flex items-center justify-center relative group"
                    style={{
                        boxShadow: `6px 6px 0px 0px ${THEME.colors.primary}`
                    }}
                >
                    {renderHeaderMedia()}
                    
                    {/* Edit Media Overlay */}
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in z-20">
                            {isUploading ? (
                                <div className="text-white flex flex-col items-center">
                                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                    <span className="text-xs font-bold uppercase">Mengupload Media...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-4 mb-2">
                                        <label className="cursor-pointer flex flex-col items-center gap-1 text-white hover:text-yellow-300 transition-colors group/btn">
                                            <div className="p-2 bg-white/10 rounded-full group-hover/btn:bg-white/20 transition-colors">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase">Upload</span>
                                            <input 
                                                type="file" 
                                                accept="image/*,video/mp4,video/webm"
                                                onChange={handleMediaUpload}
                                                className="hidden"
                                            />
                                        </label>
                                        
                                        <button 
                                            onClick={toggleHeaderFormat}
                                            className="flex flex-col items-center gap-1 text-white hover:text-yellow-300 transition-colors group/btn"
                                        >
                                            <div className="p-2 bg-white/10 rounded-full group-hover/btn:bg-white/20 transition-colors">
                                                {content.organization.headerImage.includes('#video') ? <PlayCircle className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase">
                                                Format: {content.organization.headerImage.includes('#video') ? 'Video' : 'Gambar'}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="w-full max-w-[220px] px-2">
                                        <input 
                                            type="text" 
                                            placeholder="Link YouTube / File MP4 / URL Gambar"
                                            value={content.organization.headerImage}
                                            onChange={(e) => updateOrganization('headerImage', e.target.value)}
                                            className="w-full p-1.5 text-[10px] border border-white/50 bg-black/50 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none text-center rounded backdrop-blur-sm"
                                        />
                                        <p className="text-[9px] text-gray-400 mt-1">*Paste Link YouTube untuk Video Background</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Titles */}
                <div className={`bg-white border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000] ${isEditing ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}>
                    {isEditing ? (
                        <div className="space-y-2">
                            <input 
                                value={content.organization.name}
                                onChange={(e) => updateOrganization('name', e.target.value)}
                                className="w-full text-center text-xl md:text-2xl font-black uppercase text-slate-900 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
                                placeholder="NAMA ORGANISASI"
                            />
                            <div className="h-1 w-20 bg-yellow-400 mx-auto my-2 border border-black"></div>
                            <input 
                                value={content.organization.tagline}
                                onChange={(e) => updateOrganization('tagline', e.target.value)}
                                className="w-full text-center text-slate-700 font-bold text-sm border-b-2 border-gray-200 focus:border-blue-500 outline-none"
                                placeholder="Tagline / Slogan"
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-xl md:text-2xl font-black uppercase text-slate-900 leading-tight tracking-tight">
                            {content.organization.name}
                            </h1>
                            <div 
                                className="h-1 w-20 mx-auto my-2 border border-black"
                                style={{ backgroundColor: THEME.colors.accent }}
                            ></div>
                            <p className="text-slate-700 font-bold text-sm">
                            {content.organization.tagline}
                            </p>
                        </>
                    )}
                </div>
                </div>

                {/* INFORMATION & COLLABORATION SECTION */}
                <section className="text-center space-y-6">
                <div className="relative">
                    <h2 
                        className="text-lg font-black uppercase tracking-wide text-slate-900 inline-block px-3 py-1 border-2 border-black transform -rotate-1 shadow-[3px_3px_0px_0px_#000]"
                        style={{ backgroundColor: THEME.colors.accent }}
                    >
                    INFORMASI & KOLABORASI
                    </h2>
                    {isEditing ? (
                        <input 
                            value={content.organization.description}
                            onChange={(e) => updateOrganization('description', e.target.value)}
                            className="block w-full text-center text-sm font-bold text-slate-600 mt-4 border border-dashed border-gray-400 p-1 bg-transparent"
                        />
                    ) : (
                        <p className="text-sm font-bold text-slate-600 mt-4">
                        {content.organization.description || "Silakan Hubungi Nomor Di Bawah"}
                        </p>
                    )}
                </div>
                
                <LinkTree />
                </section>

                {/* PODCAST SECTION */}
                <section className="text-center space-y-6 pt-6 border-t-4 border-black border-dashed">
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900 flex items-center justify-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full border border-black animate-pulse"></span>
                        {isEditing ? (
                            <input 
                                value={content.podcast.title}
                                onChange={(e) => updatePodcast('title', e.target.value)}
                                className="bg-transparent border-b border-black text-center focus:outline-none"
                            />
                        ) : content.podcast.title}
                    </h2>
                    {isEditing && (
                        <input 
                            value={content.podcast.videoUrl}
                            onChange={(e) => updatePodcast('videoUrl', e.target.value)}
                            placeholder="Paste YouTube Link Here..."
                            className="text-xs p-1 border border-gray-300 rounded w-full max-w-xs text-center"
                        />
                    )}
                </div>
                
                <div 
                    className="w-full aspect-video rounded-xl overflow-hidden border-2 border-black relative bg-black group transition-transform hover:-translate-y-1"
                    style={{ 
                        boxShadow: '6px 6px 0px 0px #000',
                        ['--hover-shadow' as any]: `8px 8px 0px 0px ${THEME.colors.accent}`
                    }}
                >
                    {/* Dynamic hover style via inline style wasn't applying cleanly to tailwind classes, using standard hover class with style override strategy or clean class */}
                    <div className="absolute inset-0 pointer-events-none border-0 transition-all group-hover:shadow-[8px_8px_0px_0px_var(--accent-color)]" style={{ ['--accent-color' as any]: THEME.colors.accent }}></div>

                    {/* YouTube Embed - KEY ADDED FOR RELOAD */}
                    <iframe 
                    key={content.podcast.videoUrl}
                    width="100%" 
                    height="100%" 
                    src={`${getEmbedUrl(content.podcast.videoUrl)}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="absolute inset-0"
                    ></iframe>
                </div>
                </section>
            </>
        )}

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm font-bold text-slate-500 border-t-2 border-black bg-white">
         &copy; {new Date().getFullYear()} {content.organization.name}
      </footer>
    </div>
  );
};

export default App;