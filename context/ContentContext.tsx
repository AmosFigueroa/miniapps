import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentData, SocialLink } from '../types';
import { ORGANIZATION_INFO, SOCIAL_LINKS } from '../constants';
import { sheetApi } from '../services/sheetApi';

// Initial Default Data
const DEFAULT_CONTENT: ContentData = {
  organization: {
    name: ORGANIZATION_INFO.name,
    tagline: ORGANIZATION_INFO.tagline,
    description: ORGANIZATION_INFO.description,
    headerImage: '',
  },
  podcast: {
    title: "Podcast Terbaru",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  links: SOCIAL_LINKS
};

interface ContentContextType {
  content: ContentData;
  isEditing: boolean;
  isAuthModalOpen: boolean;
  isLoadingData: boolean;
  toggleEditMode: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (password: string) => Promise<void>;
  logout: () => void;
  updateOrganization: (key: keyof ContentData['organization'], value: string) => void;
  updatePodcast: (key: keyof ContentData['podcast'], value: string) => void;
  addLink: (category: 'contact' | 'social') => void;
  removeLink: (id: string) => void;
  updateLink: (id: string, field: keyof SocialLink, value: string) => void;
  saveChanges: () => Promise<void>;
  sessionPassword: string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sessionPassword, setSessionPassword] = useState<string | null>(null);

  // Load Data on Mount
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoadingData(true);
    try {
      const data = await sheetApi.fetchData();
      
      // Check if data exists AND has the correct structure (organization key)
      if (data && typeof data === 'object' && 'organization' in data) {
        setContent((prev) => ({
             ...prev,
             ...data,
             organization: { ...prev.organization, ...data.organization },
             podcast: { ...prev.podcast, ...data.podcast },
             links: Array.isArray(data.links) ? data.links : prev.links
        }));
      } else {
        // Fallback: If API data is empty (Sheet baru dibuat otomatis oleh GAS),
        // Kita gunakan DEFAULT_CONTENT lokal.
        // OPTIONAL: Auto-seed (Simpan default ke server jika kita punya password default, 
        // tapi karena kita butuh password, kita biarkan user save manual nanti atau pakai local storage)
        console.log("Database kosong atau baru. Menggunakan template default.");
        
        const saved = localStorage.getItem('site_content');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.organization) {
                    setContent(parsed);
                }
            } catch (e) {
                console.error("Local storage corrupted", e);
            }
        }
      }
    } catch (error) {
      console.log("Failed to fetch from Google Sheet, using local/default.", error);
      const saved = localStorage.getItem('site_content');
      if (saved) {
         try {
             const parsed = JSON.parse(saved);
             if (parsed && parsed.organization) {
                 setContent(parsed);
             }
         } catch (e) {}
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const saveChanges = async () => {
    if (!sessionPassword) {
        alert("Sesi habis. Silakan login ulang.");
        openAuthModal();
        return;
    }
    
    try {
      const response = await sheetApi.saveData(content, sessionPassword);
      
      if (response.success) {
          // Backup local
          localStorage.setItem('site_content', JSON.stringify(content));
          alert("✅ Sukses! Data tersimpan di Google Sheet.");
      } else {
          alert("❌ Gagal menyimpan: " + response.message);
      }
    } catch (error: any) {
      console.error("Save failed", error);
      alert("❌ Error Koneksi. Pastikan URL Script benar.");
    }
  };

  const login = async (pass: string) => {
    try {
      const res = await sheetApi.login(pass);
      if (res.success) {
          setSessionPassword(pass);
          setIsEditing(true);
      } else {
          throw new Error(res.message || "Password salah");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setSessionPassword(null);
    setIsEditing(false);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  
  const toggleEditMode = () => {
      if (!sessionPassword) {
          openAuthModal();
      } else {
          setIsEditing(prev => !prev);
      }
  };

  // Content Modifiers
  const updateOrganization = (key: keyof ContentData['organization'], value: string) => {
    setContent(prev => ({
      ...prev,
      organization: { ...prev.organization, [key]: value }
    }));
  };

  const updatePodcast = (key: keyof ContentData['podcast'], value: string) => {
    setContent(prev => ({
      ...prev,
      podcast: { ...prev.podcast, [key]: value }
    }));
  };

  const addLink = (category: 'contact' | 'social') => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      title: category === 'contact' ? 'Link Baru' : 'Sosmed',
      url: 'https://',
      category,
      iconName: category === 'social' ? 'Globe' : 'Phone',
      highlight: category === 'contact'
    };
    setContent(prev => ({ ...prev, links: [...prev.links, newLink] }));
  };

  const removeLink = (id: string) => {
    setContent(prev => ({ ...prev, links: prev.links.filter(l => l.id !== id) }));
  };

  const updateLink = (id: string, field: keyof SocialLink, value: string) => {
    setContent(prev => ({
      ...prev,
      links: prev.links.map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      isEditing, 
      isAuthModalOpen,
      isLoadingData,
      sessionPassword,
      toggleEditMode, 
      openAuthModal,
      closeAuthModal,
      login,
      logout,
      updateOrganization, 
      updatePodcast,
      addLink, 
      removeLink, 
      updateLink,
      saveChanges
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within a ContentProvider");
  return context;
};