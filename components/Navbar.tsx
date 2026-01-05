import React from 'react';
import { Hexagon, Edit, Save, LogOut, Loader, UserCircle } from 'lucide-react';
import { THEME } from '../constants';
import { useContent } from '../context/ContentContext';

const Navbar: React.FC = () => {
  const { content, isEditing, toggleEditMode, currentUser, logout, saveChanges, isLoadingData } = useContent();

  const handleSave = async () => {
      await saveChanges();
  };

  return (
    <nav className={`sticky top-0 z-40 bg-white border-b-2 border-black px-4 py-3 flex items-center shadow-sm font-sans transition-colors ${isEditing ? 'bg-yellow-50' : ''}`}>
      {/* Logo & Name Container */}
      <div className="flex items-center gap-3 flex-1">
        <div className="shrink-0 p-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000]" style={{ backgroundColor: THEME.colors.accent }}>
           <Hexagon className="w-5 h-5 text-black fill-current" />
        </div>
        <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black tracking-tighter text-slate-900 uppercase leading-tight line-clamp-1">
                {content.organization.name}
            </span>
            {isLoadingData && <span className="text-[10px] text-gray-400">Loading data...</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 items-center">
        {currentUser ? (
            <>
                {/* Save Button (Only visible when editing) */}
                {isEditing && (
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg border-2 border-black hover:bg-blue-700 active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000]"
                        title="Simpan Perubahan ke Server"
                    >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">SIMPAN</span>
                    </button>
                )}

                {/* Edit Toggle */}
                <button 
                    onClick={toggleEditMode}
                    className={`p-2 rounded-lg border-2 border-black transition-all active:translate-y-0.5 ${isEditing ? 'bg-green-400 shadow-[2px_2px_0px_0px_#000]' : 'bg-gray-100 hover:bg-gray-200'}`}
                    title={isEditing ? "Selesai Edit" : "Mulai Edit"}
                >
                    <Edit className="w-5 h-5" />
                </button>

                {/* Logout */}
                <button 
                    onClick={() => logout()}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Logout Admin"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </>
        ) : (
            /* Login Button (If not logged in) */
            <button 
                onClick={toggleEditMode} // This triggers openAuthModal because currentUser is null
                className="flex items-center gap-2 px-3 py-2 bg-black text-white text-xs font-bold rounded-lg border-2 border-transparent hover:bg-gray-800 transition-all"
            >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">ADMIN</span>
            </button>
        )}
      </div>
    </nav>
  );
};
export default Navbar;