import React, { useState } from 'react';
import { Palette, X, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const ThemeEditor: React.FC = () => {
  const { content, updateTheme, isEditing } = useContent();
  const [isOpen, setIsOpen] = useState(false);

  if (!isEditing) return null;

  const colors = [
    { key: 'background', label: 'Latar Belakang' },
    { key: 'navbar', label: 'Warna Navbar' },
    { key: 'cardBackground', label: 'Warna Kotak/Card' },
    { key: 'textMain', label: 'Warna Teks Utama' },
    { key: 'primaryButton', label: 'Tombol Utama' },
    { key: 'buttonText', label: 'Teks Tombol' },
    { key: 'accent', label: 'Aksen/Highlight' },
  ] as const;

  const handleReset = () => {
    if(window.confirm('Reset warna ke default?')) {
        updateTheme('background', '#f0f0f0');
        updateTheme('cardBackground', '#ffffff');
        updateTheme('textMain', '#102C57');
        updateTheme('primaryButton', '#102C57');
        updateTheme('buttonText', '#ffffff');
        updateTheme('accent', '#FFC300');
        updateTheme('navbar', '#ffffff');
    }
  };

  return (
    <div className="fixed bottom-24 left-4 z-40 flex flex-col items-start gap-2">
       {isOpen && (
           <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] w-64 animate-in slide-in-from-bottom-5 duration-200 mb-2 max-h-[60vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                   <h3 className="font-black uppercase text-sm">Edit Tema Warna</h3>
                   <button onClick={handleReset} className="p-1 hover:bg-gray-100 rounded text-red-500" title="Reset Default">
                       <RotateCcw size={14} />
                   </button>
               </div>
               
               <div className="space-y-3">
                   {colors.map((color) => (
                       <div key={color.key} className="flex flex-col gap-1">
                           <label className="text-xs font-bold text-gray-600 uppercase">{color.label}</label>
                           <div className="flex gap-2 items-center">
                               <input 
                                   type="color" 
                                   value={content.theme[color.key]}
                                   onChange={(e) => updateTheme(color.key, e.target.value)}
                                   className="w-8 h-8 p-0 border-2 border-black rounded cursor-pointer overflow-hidden shrink-0"
                               />
                               <input 
                                   type="text" 
                                   value={content.theme[color.key]}
                                   onChange={(e) => updateTheme(color.key, e.target.value)}
                                   className="flex-1 text-xs border border-gray-300 rounded p-1 font-mono uppercase"
                               />
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       )}

       <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all active:translate-y-0"
       >
           <Palette size={18} />
           {isOpen ? 'Tutup Warna' : 'Ganti Warna'}
           {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
       </button>
    </div>
  );
};

export default ThemeEditor;