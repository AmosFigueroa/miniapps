import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentData, SocialLink, ToastData, ToastType, ThemeSettings } from '../types';
import { sheetApi } from '../services/sheetApi';

// Initial Default Theme
const DEFAULT_THEME: ThemeSettings = {
    background: '#f0f0f0',
    cardBackground: '#ffffff',
    textMain: '#102C57',
    primaryButton: '#102C57',
    buttonText: '#ffffff',
    accent: '#FFC300',
    navbar: '#ffffff'
};

// Initial Default Data
const DEFAULT_CONTENT: ContentData = {
  organization: {
    name: "",
    tagline: "",
    description: "",
    headerImage: '',
    sectionTitle: "INFORMASI & KOLABORASI", // Default Value
  },
  podcast: {
    title: "",
    videoUrl: "",
  },
  links: [],
  theme: DEFAULT_THEME
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
  updateTheme: (key: keyof ThemeSettings, value: string) => void;
  addLink: (category: 'contact' | 'social') => void;
  removeLink: (id: string) => void;
  updateLink: (id: string, field: keyof SocialLink, value: string) => void;
  saveChanges: () => Promise<void>;
  sessionPassword: string | null;
  // Toast Props
  toast: ToastData;
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sessionPassword, setSessionPassword] = useState<string | null>(null);
  
  // Toast State
  const [toast, setToast] = useState<ToastData>({ message: '', type: 'info', isVisible: false });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

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
             organization: { 
                 ...DEFAULT_CONTENT.organization, // Ensure defaults
                 ...prev.organization, 
                 ...data.organization 
             },
             podcast: { ...prev.podcast, ...data.podcast },
             links: Array.isArray(data.links) ? data.links : prev.links,
             // Merge theme carefully to ensure all keys exist if new keys were added to code later
             theme: { ...DEFAULT_THEME, ...data.theme } 
        }));
      } else {
        loadFromLocal();
      }
    } catch (error) {
      console.log("Failed to fetch from Google Sheet, using local/default.", error);
      loadFromLocal();
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadFromLocal = () => {
      const saved = localStorage.getItem('site_content');
      if (saved) {
         try {
             const parsed = JSON.parse(saved);
             if (parsed && parsed.organization) {
                 // Ensure theme exists when loading from old local storage
                 const theme = parsed.theme ? { ...DEFAULT_THEME, ...parsed.theme } : DEFAULT_THEME;
                 const organization = { ...DEFAULT_CONTENT.organization, ...parsed.organization };
                 setContent({ ...parsed, organization, theme });
             }
         } catch (e) {}
      }
  };

  const saveChanges = async () => {
    if (!sessionPassword) {
        showToast("Sesi telah berakhir. Silakan login kembali.", 'warning');
        openAuthModal();
        return;
    }
    
    showToast("Sedang menyimpan data...", 'info');

    try {
      const response = await sheetApi.saveData(content, sessionPassword);
      
      if (response.success) {
          localStorage.setItem('site_content', JSON.stringify(content));
          showToast("Data berhasil disimpan ke Google Sheet!", 'success');
      } else {
          showToast("Gagal menyimpan: " + response.message, 'error');
      }
    } catch (error: any) {
      console.error("Save failed", error);
      showToast("Gagal terkoneksi ke Server. Cek internet anda.", 'error');
    }
  };

  const login = async (pass: string) => {
    try {
      const res = await sheetApi.login(pass);
      if (res.success) {
          setSessionPassword(pass);
          setIsEditing(true);
          showToast("Login Berhasil! Mode Edit Aktif.", 'success');
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
    showToast("Logout Berhasil.", 'info');
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

  const updateTheme = (key: keyof ThemeSettings, value: string) => {
      setContent(prev => ({
          ...prev,
          theme: { ...prev.theme, [key]: value }
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
      updateTheme,
      addLink, 
      removeLink, 
      updateLink,
      saveChanges,
      toast,
      showToast,
      hideToast
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