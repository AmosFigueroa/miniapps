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
        if (url.includes('embed')) return url;
        
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be')) {
            videoId = url.split('/').pop() || '';
        }
        
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        return url;
    } catch {
        return url;
    }
}

const App: React.FC = () => {
  const { content, isEditing, updateOrganization, updatePodcast, openAuthModal, sessionPassword, toast, hideToast, showToast } = useContent();
  const [isUploading, setIsUploading] = useState(false);

  // Trigger login if URL contains ?mode=admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
        openAuthModal();
    }
  }, []);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files[0]) return;
      if (!sessionPassword) {
          showToast("Sesi habis, silakan login ulang.", 'warning');
          return;
      }

      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video/');
      const isGif = file.type === 'image/gif';

      // Limit size (Google Script limit workaround)
      if (file.size > 10 * 1024 * 1024) {
          showToast("Ukuran file terlalu besar! Maksimal 10MB.", 'warning');
          return;
      }

      setIsUploading(true);
      showToast(isVideo ? "Mengupload video..." : "Mengupload gambar...", 'info');
      
      try {
          let url = await sheetApi.uploadImage(file, sessionPassword) as string;
          
          // CRITICAL FIX: Convert Drive View Link to Direct Link for ALL media types (Video, Image, GIF)
          // Google Drive 'view' links don't work in <img src> or <video src>
          if (url.includes('drive.google.com')) {
             // Match /d/ID or id=ID
             const driveIdMatch = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
             if (driveIdMatch && driveIdMatch[1]) {
                 url = `https://drive.google.com/uc?export=download&id=${driveIdMatch[1]}`;
             }
          }
          
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

  const renderHeaderMedia = () => {
      const url = content.organization.headerImage;
      if (!url) {
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
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
           const embedUrl = getEmbedUrl(url);
           // Add autoplay and loop parameters for header background feel
           const playlistId = embedUrl.split('/').pop(); 
           const headerVideoSrc = `${embedUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${playlistId}&playsinline=1`;
           
           return (
              <iframe 
                src={headerVideoSrc}
                title="Header Video"
                className="w-full h-full object-cover pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                frameBorder="0"
              />
           );
      }

      // Check if video by Extension or Hash tag
      const isVideo = url.includes('#video') || url.match(/\.(mp4|webm|mov|ogg)$/i);
      const cleanUrl = url.split('#')[0]; // Remove hash for source

      if (isVideo) {
          return (
              <video 
                key={cleanUrl} // FORCE RELOAD when URL changes
                src={cleanUrl} 
                className="w-full h-full object-cover"
                autoPlay 
                loop 
                muted 
                playsInline 
              />
          );
      }

      // Render Image or GIF
      return <img src={cleanUrl} alt="Header" className="w-full h-full object-cover" />;
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
                            <label className="cursor-pointer flex flex-col items-center gap-2 text-white hover:text-yellow-300 transition-colors">
                                <Upload className="w-8 h-8" />
                                <span className="text-xs font-bold uppercase border-b-2 border-dashed border-white/50 pb-0.5">
                                    Upload Media (Max 10MB)
                                </span>
                                <span className="text-[10px] text-gray-300 font-medium">
                                    Foto / GIF / Video (MP4)
                                </span>
                                <input 
                                    type="file" 
                                    accept="image/*,video/mp4,video/webm"
                                    onChange={handleMediaUpload}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-[10px] text-gray-300">atau</span>
                            <input 
                                type="text" 
                                placeholder="Paste Link URL Media..."
                                value={content.organization.headerImage}
                                onChange={(e) => updateOrganization('headerImage', e.target.value)}
                                className="w-full max-w-[200px] p-1 text-xs border border-white bg-transparent text-white placeholder-gray-400 focus:bg-black focus:outline-none text-center"
                            />
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

            {/* YouTube Embed - Added autoplay=1&mute=1 */}
            <iframe 
              width="100%" 
              height="100%" 
              src={`${getEmbedUrl(content.podcast.videoUrl)}?autoplay=1&mute=1&playsinline=1`}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm font-bold text-slate-500 border-t-2 border-black bg-white">
         &copy; {new Date().getFullYear()} {content.organization.name}
      </footer>
    </div>
  );
};

export default App;