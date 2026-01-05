import React, { useState } from 'react';
import { X, LogIn, Loader2, AlertCircle, CircleHelp } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useContent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowTroubleshoot(false);
    
    try {
      await login(email, password);
      closeAuthModal();
    } catch (err: any) {
      console.error("Login Error:", err);
      
      // Handle "Failed to fetch" specifically (CORS/Platform issue)
      if (err.message === "Failed to fetch" || err.message?.includes("NetworkError")) {
          setError("Koneksi Ditolak (CORS). Domain belum terdaftar.");
          setShowTroubleshoot(true);
      } 
      // Handle invalid credentials
      else if (err.code === 401 || err.message?.includes("Invalid credentials")) {
          setError("Email atau Password salah.");
      }
      // General error
      else if (err && err.message) {
          setError(err.message);
      } else {
          setError('Terjadi kesalahan tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-sm bg-white border-2 border-black p-6 rounded-xl shadow-[8px_8px_0px_0px_#DFFF00] relative animate-in fade-in zoom-in duration-200 my-auto"
      >
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="p-3 bg-blue-900 rounded-full text-white border-2 border-black">
            <LogIn size={24} />
          </div>
          <h2 className="text-xl font-black uppercase text-center">Login Admin</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold rounded-lg flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
              
              {showTroubleshoot && (
                <div className="mt-2 pt-2 border-t border-red-200 text-[10px] leading-relaxed text-slate-700 font-normal">
                  <strong>CARA MEMPERBAIKI (APPWRITE):</strong>
                  <ol className="list-decimal ml-4 mt-1 space-y-1">
                    <li>Buka <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer" className="underline font-bold text-blue-600">Appwrite Console</a></li>
                    <li>Pilih Project &gt; <strong>Overview</strong></li>
                    <li>Scroll ke bawah ke bagian <strong>Platforms</strong></li>
                    <li>Klik <strong>+ Add Platform</strong> &gt; <strong>Web App</strong></li>
                    <li>Isi <strong>Name</strong> (bebas) & <strong>Hostname</strong> dengan domain website ini.
                        <ul className="list-disc ml-4 mt-1 text-slate-500">
                          <li>Jika local: <code>localhost</code></li>
                          <li>Jika preview: copy hostname dari URL bar (tanpa https://)</li>
                        </ul>
                    </li>
                    <li>Simpan & Coba Login lagi.</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1 ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none focus:ring-0 font-bold"
              placeholder="admin@upy.ac.id"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none focus:ring-0 font-bold"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white font-black uppercase tracking-wider rounded-lg hover:translate-y-[-2px] hover:shadow-lg active:translate-y-[0px] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Masuk Dashboard'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
            <button 
                type="button"
                onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                className="text-[10px] text-gray-400 font-medium hover:text-black flex items-center justify-center gap-1 w-full"
            >
                <CircleHelp size={12} />
                {showTroubleshoot ? "Sembunyikan Bantuan" : "Bantuan Koneksi"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;