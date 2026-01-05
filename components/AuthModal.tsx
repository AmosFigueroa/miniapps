import React, { useState } from 'react';
import { X, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useContent();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(password);
      setPassword('');
      closeAuthModal();
      // Remove query param to clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('mode');
      window.history.replaceState({}, '', url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Password Salah atau Gagal Koneksi ke Google Script.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-sm bg-white border-2 border-black p-6 rounded-xl shadow-[8px_8px_0px_0px_#DFFF00] relative animate-in fade-in zoom-in duration-200"
      >
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="p-3 bg-slate-900 rounded-full text-white border-2 border-black">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-black uppercase text-center">Akses Admin</h2>
          <p className="text-xs text-center text-gray-500">Masukkan Password Admin yang ada di Google Sheet (Config!B1)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold rounded-lg flex items-center gap-2">
               <AlertCircle size={16} />
               {error}
            </div>
          )}

          <div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 text-center text-lg tracking-widest border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none focus:ring-0 font-bold"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black text-white font-black uppercase tracking-wider rounded-lg hover:translate-y-[-2px] hover:shadow-lg active:translate-y-[0px] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Buka Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;