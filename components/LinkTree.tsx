import React from 'react';
import { THEME } from '../constants';
import { useContent } from '../context/ContentContext';
import { Trash2, Plus, Phone, Instagram, Youtube, Music, Globe, Twitter, Mail } from 'lucide-react';

// Icon mapping helper
const getIcon = (iconName?: string) => {
    switch(iconName) {
        case 'Instagram': return Instagram;
        case 'Youtube': return Youtube;
        case 'Music': return Music;
        case 'Twitter': return Twitter;
        case 'Globe': return Globe;
        case 'Mail': return Mail;
        default: return Phone;
    }
};

const LinkTree: React.FC = () => {
  const { content, isEditing, addLink, removeLink, updateLink } = useContent();
  const contactLinks = content.links.filter(link => link.category === 'contact');
  const socialLinks = content.links.filter(link => link.category === 'social');

  return (
    <div className="w-full space-y-8">
      
      {/* Contact Buttons Section */}
      <div className="space-y-4">
        {contactLinks.map((link) => (
          <div key={link.id} className="relative group max-w-xs mx-auto">
              {isEditing ? (
                  <div 
                    className="flex flex-col gap-2 p-3 border-2 border-black bg-white rounded-xl shadow-[4px_4px_0px_0px_#ccc]"
                  >
                      <input 
                        value={link.title}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        className="font-bold border-b border-gray-300 focus:outline-none"
                        placeholder="Label Tombol"
                      />
                      <input 
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="text-xs text-blue-600 border-b border-gray-300 focus:outline-none"
                        placeholder="https://..."
                      />
                      <button 
                        onClick={() => removeLink(link.id)}
                        className="self-end text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                          <Trash2 size={16} />
                      </button>
                  </div>
              ) : (
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-6 rounded-full text-center font-black text-white uppercase tracking-wider border-2 border-black transition-all hover:-translate-y-1 hover:shadow-none active:translate-y-1"
                    style={{ 
                    backgroundColor: THEME.colors.primary,
                    boxShadow: `4px 4px 0px 0px #000` // Hard Black Shadow
                    }}
                >
                    {link.title}
                </a>
              )}
          </div>
        ))}

        {isEditing && (
            <button 
                onClick={() => addLink('contact')}
                className="w-full max-w-xs mx-auto py-2 border-2 border-dashed border-gray-400 text-gray-500 font-bold rounded-lg hover:bg-gray-50 flex justify-center items-center gap-2"
            >
                <Plus size={18} /> Tambah Tombol
            </button>
        )}
      </div>

      {/* Social Icons Row */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        {socialLinks.map((link) => {
          const Icon = getIcon(link.iconName);
          
          if (isEditing) {
              return (
                <div key={link.id} className="flex flex-col items-center bg-white border border-black p-2 rounded-lg gap-1 relative">
                    <button 
                        onClick={() => removeLink(link.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 border border-black z-10"
                    >
                        <Trash2 size={10} />
                    </button>
                    <select 
                        value={link.iconName} 
                        onChange={(e) => updateLink(link.id, 'iconName', e.target.value)}
                        className="text-xs border rounded mb-1 w-20"
                    >
                        <option value="Instagram">IG</option>
                        <option value="Youtube">YT</option>
                        <option value="Music">TikTok</option>
                        <option value="Twitter">X</option>
                        <option value="Globe">Web</option>
                        <option value="Mail">Mail</option>
                    </select>
                    <input 
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="text-[10px] w-20 border-b border-gray-300"
                        placeholder="URL..."
                    />
                </div>
              );
          }

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white text-slate-900 border-2 border-black transition-all hover:-translate-y-1 hover:bg-yellow-300"
              style={{ 
                  boxShadow: '3px 3px 0px 0px #000'
              }}
              aria-label={link.title}
            >
              <Icon className="w-6 h-6" strokeWidth={2.5} />
            </a>
          );
        })}

        {isEditing && (
            <button 
                onClick={() => addLink('social')}
                className="p-3 rounded-full border-2 border-dashed border-gray-400 text-gray-400 hover:text-black hover:border-black transition-colors"
                title="Tambah Sosmed"
            >
                <Plus size={24} />
            </button>
        )}
      </div>
    </div>
  );
};

export default LinkTree;