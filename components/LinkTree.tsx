import React from 'react';
import { useContent } from '../context/ContentContext';
import { 
  Trash2, Plus, Phone, Instagram, Youtube, Globe, Mail, 
  Facebook, Twitter, Linkedin, MessageCircle, MapPin, ShoppingBag, Github,
  Gamepad2, Music2, Mic2, Tv, Send
} from 'lucide-react';

// Custom TikTok Icon (SVG)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    stroke="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
  </svg>
);

// Icon mapping helper
const getIcon = (iconName?: string) => {
    switch(iconName) {
        case 'Instagram': return Instagram;
        case 'Youtube': return Youtube;
        case 'TikTok': return TikTokIcon;
        case 'Facebook': return Facebook;
        case 'Twitter': return Twitter;
        case 'Linkedin': return Linkedin;
        case 'WhatsApp': return MessageCircle;
        case 'Telegram': return Send;
        case 'Discord': return Gamepad2;
        case 'Spotify': return Music2;
        case 'Podcast': return Mic2;
        case 'Live': return Tv;
        case 'Github': return Github;
        case 'MapPin': return MapPin;
        case 'Shop': return ShoppingBag;
        case 'Mail': return Mail;
        default: return Globe;
    }
};

const ICON_OPTIONS = [
    { label: 'Instagram', value: 'Instagram' },
    { label: 'TikTok', value: 'TikTok' },
    { label: 'YouTube', value: 'Youtube' },
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Twitter', value: 'Twitter' },
    { label: 'LinkedIn', value: 'Linkedin' },
    { label: 'Telegram', value: 'Telegram' },
    { label: 'Discord', value: 'Discord' },
    { label: 'Spotify', value: 'Spotify' },
    { label: 'Podcast', value: 'Podcast' },
    { label: 'Toko/Shop', value: 'Shop' },
    { label: 'Website', value: 'Globe' },
    { label: 'Email', value: 'Mail' },
    { label: 'Lokasi', value: 'MapPin' },
    { label: 'GitHub', value: 'Github' },
];

const LinkTree: React.FC = () => {
  const { content, isEditing, addLink, removeLink, updateLink } = useContent();
  const theme = content.theme;
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
                    className="flex flex-col gap-2 p-3 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#ccc]"
                    style={{ backgroundColor: theme.cardBackground }}
                  >
                      <input 
                        value={link.title}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        className="font-bold border-b border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
                        placeholder="Label Tombol"
                        style={{ color: theme.textMain }}
                      />
                      <input 
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="text-xs text-blue-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 transition-colors bg-transparent"
                        placeholder="https://..."
                      />
                      <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-gray-400 font-mono">ID: {link.id.slice(-4)}</span>
                          <button 
                            onClick={() => removeLink(link.id)}
                            className="flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                          >
                              <Trash2 size={12} /> Hapus
                          </button>
                      </div>
                  </div>
              ) : (
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-6 rounded-full text-center font-black uppercase tracking-wider border-2 border-black transition-all hover:-translate-y-1 hover:shadow-none active:translate-y-1"
                    style={{ 
                        backgroundColor: theme.primaryButton,
                        color: theme.buttonText,
                        boxShadow: `4px 4px 0px 0px #000` // Hard Black Shadow remains black for style
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
                className="w-full max-w-xs mx-auto py-2 border-2 border-dashed border-gray-400 text-gray-500 font-bold rounded-lg hover:bg-white/50 flex justify-center items-center gap-2"
            >
                <Plus size={18} /> Tambah Tombol Utama
            </button>
        )}
      </div>

      {/* Social Icons Row */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        {socialLinks.map((link) => {
          const Icon = getIcon(link.iconName);
          
          if (isEditing) {
              return (
                <div key={link.id} className="flex flex-col items-center border-2 border-black p-2 rounded-lg gap-2 relative shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-shadow" style={{ backgroundColor: theme.cardBackground }}>
                    <button 
                        onClick={() => removeLink(link.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 border-2 border-white shadow-sm z-10 hover:scale-110 transition-transform"
                        title="Hapus Icon"
                    >
                        <Trash2 size={10} />
                    </button>
                    
                    {/* Visual Preview & Dropdown Wrapper */}
                    <div className="relative w-full">
                        <div className="flex justify-center mb-2">
                             <div className="p-2 bg-gray-100 rounded-full border border-gray-200">
                                <Icon className="w-6 h-6 text-slate-800" />
                             </div>
                        </div>
                        
                        <div className="relative">
                            <select 
                                value={link.iconName || 'Globe'} 
                                onChange={(e) => updateLink(link.id, 'iconName', e.target.value)}
                                className="w-28 text-[11px] font-bold border-2 border-black rounded-md py-1 px-1 focus:outline-none focus:bg-white cursor-pointer"
                                style={{ backgroundColor: theme.accent, color: theme.textMain }}
                            >
                                {ICON_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <input 
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="text-[10px] w-28 border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-center text-blue-600 bg-transparent"
                        placeholder="Link URL..."
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
              className="p-3 rounded-full border-2 border-black transition-all hover:-translate-y-1 group"
              style={{ 
                  backgroundColor: theme.cardBackground,
                  color: theme.textMain,
                  boxShadow: '3px 3px 0px 0px #000'
              }}
              onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.accent;
              }}
              onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.cardBackground;
              }}
              aria-label={link.title}
              title={link.title}
            >
              <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
            </a>
          );
        })}

        {isEditing && (
            <button 
                onClick={() => addLink('social')}
                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-dashed border-gray-400 text-gray-400 hover:text-black hover:border-black hover:bg-white transition-all"
                title="Tambah Icon Sosmed"
            >
                <Plus size={24} />
            </button>
        )}
      </div>
    </div>
  );
};

export default LinkTree;