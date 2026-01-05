import React from 'react';
import { Pencil, Save, LogOut } from 'lucide-react';
import { THEME } from '../constants';
import { useContent } from '../context/ContentContext';

const Navbar: React.FC = () => {
  const { content, isEditing, toggleEditMode, sessionPassword, logout, saveChanges, isLoadingData } = useContent();

  return (
    <nav className={`sticky top-0 z-40 bg-white border-b-2 border-black px-4 py-3 flex items-center justify-center shadow-sm font-sans transition-colors relative min-h-[64px] ${isEditing ? 'bg-yellow-50' : ''}`}>
      {/* Logo & Name Container */}
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] overflow-hidden bg-white">
           <img 
             src="https://i.ibb.co.com/9H7TtXC5/logo-fakul-baru.webp" 
             alt="Logo" 
             className="w-full h-full object-cover"
           />
        </div>
        <div className="flex flex-col justify-center min-h-[40px]">
            <span className="text-sm sm:text-base font-black tracking-tighter text-slate-900 uppercase leading-tight line-clamp-1">
                {content.organization.name || (isLoadingData ? "..." : "")}
            </span>
        </div>
      </div>

      {/* Controls - ONLY VISIBLE IF LOGGED IN - Positioned Absolutely */}
      {sessionPassword && (
          <div className="absolute right-4 flex gap-2 items-center animate-in fade-in duration-300">
            {/* Save Button (Only visible when editing) */}
            {isEditing && (
                <button 
                    onClick={() => saveChanges()}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg border-2 border-black hover:bg-blue-700 active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000]"
                    title="Simpan ke Google Sheet"
                >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">SIMPAN</span>
                </button>
            )}

            {/* Edit Toggle */}
            <button 
                onClick={toggleEditMode}
                className={`p-2 rounded-lg border-2 border-black transition-all active:translate-y-0.5 ${isEditing ? 'bg-green-400 shadow-[2px_2px_0px_0px_#000]' : 'bg-gray-100 hover:bg-gray-200'}`}
                title={isEditing ? "Selesai Edit" : "Mode Edit"}
            >
                <Pencil className="w-5 h-5" />
            </button>

            {/* Logout */}
            <button 
                onClick={() => logout()}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Logout Admin"
            >
                <LogOut className="w-5 h-5" />
            </button>
          </div>
      )}
    </nav>
  );
};
export default Navbar;