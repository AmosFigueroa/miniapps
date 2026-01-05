import React, { useEffect, useState } from 'react';
import { THEME } from './constants';
import LinkTree from './components/LinkTree';
import VirtualHumas from './components/VirtualHumas';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import { useContent } from './context/ContentContext';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { sheetApi } from './services/sheetApi';

// Helper to get youtube embed url
const getEmbedUrl = (url: string) => {
    try {
        if (url.includes('embed')) return url;
        const v = url.split('v=')[1]?.split('&')[0];
        if (v) return `https://www.youtube.com/embed/${v}`;
        if (url.includes('youtu.be')) return `https://www.youtube.com/embed/${url.split('/').pop()}`;
        return url;
    } catch {
        return url;
    }
}

const App: React.FC = () => {
  const { content, isEditing, updateOrganization, updatePodcast, openAuthModal, sessionPassword } = useContent();
  const [isUploading, setIsUploading] = useState(false);

  // Trigger login if URL contains ?mode=admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
        openAuthModal();
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files[0]) return;
      if (!sessionPassword) {
          alert("Sesi habis, silakan login ulang.");
          return;
      }

      setIsUploading(true);
      try {
          const file = e.target.files[0];
          // Limit size to avoid GAS timeout (approx 4MB safe limit)
          if (file.size > 4 * 1024 * 1024) {
              alert("Ukuran file terlalu besar! Maksimal 4MB.");
              setIsUploading(false);
              return;
          }

          const url = await sheetApi.uploadImage(file, sessionPassword) as string;
          updateOrganization('headerImage', url);
      } catch (error) {
          console.error("Upload failed", error);
          alert("Gagal upload gambar. Coba lagi.");
      } finally {
          setIsUploading(false);
      }
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-yellow-300 selection:text-black"
      style={{ 
        backgroundColor: '#f0f0f0',
        backgroundImage: `
          linear-gradient(rgba(43, 66, 122, 0.1) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(43, 66, 122, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        color: THEME.colors.textMain
      }}
    >
      <Navbar />
      <AuthModal />

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 space-y-10 pb-24">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-6">
          {/* Header Image / Illustration Placeholder */}
          <div 
            className="w-full aspect-video rounded-xl overflow-hidden border-2 border-black bg-white flex items-center justify-center relative group"
            style={{
                boxShadow: `6px 6px 0px 0px ${THEME.colors.primary}`
            }}
          >
             {content.organization.headerImage ? (
                 <img src={content.organization.headerImage} alt="Header" className="w-full h-full object-cover" />
             ) : (
                <>
                    <div className="text-center opacity-80 z-10">
                        <div className="w-16 h-16 mx-auto bg-purple-600 border-2 border-black rounded-lg mb-2 rotate-3 flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">IMG</span>
                        </div>
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Ilustrasi Header</span>
                    </div>
                    {/* Decorative element */}
                    <div 
                        className="absolute top-0 left-0 w-full h-full opacity-10" 
                        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                    ></div>
                </>
             )}
             
             {/* Edit Image Input Overlay */}
             {isEditing && (
                 <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in">
                     {isUploading ? (
                         <div className="text-white flex flex-col items-center">
                             <Loader2 className="w-8 h-8 animate-spin mb-2" />
                             <span className="text-xs font-bold uppercase">Mengupload ke Drive...</span>
                         </div>
                     ) : (
                         <>
                            <label className="cursor-pointer flex flex-col items-center gap-2 text-white hover:text-yellow-300 transition-colors">
                                <Upload className="w-8 h-8" />
                                <span className="text-xs font-bold uppercase border-b-2 border-dashed border-white/50 pb-0.5">Ganti Gambar (Max 4MB)</span>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-[10px] text-gray-300">atau</span>
                            <input 
                                type="text" 
                                placeholder="Paste Link URL Gambar..."
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
                    <div className="h-1 w-20 bg-yellow-400 mx-auto my-2 border border-black"></div>
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
             <h2 className="text-lg font-black uppercase tracking-wide text-slate-900 bg-yellow-300 inline-block px-3 py-1 border-2 border-black transform -rotate-1 shadow-[3px_3px_0px_0px_#000]">
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
            className="w-full aspect-video rounded-xl overflow-hidden border-2 border-black relative bg-black group transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#DFFF00]"
            style={{ boxShadow: '6px 6px 0px 0px #000' }}
          >
            {/* YouTube Embed */}
            <iframe 
              width="100%" 
              height="100%" 
              src={getEmbedUrl(content.podcast.videoUrl)}
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

      {/* AI HUMAS OVERLAY */}
      <VirtualHumas />
    </div>
  );
};

export default App;