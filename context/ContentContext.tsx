import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ContentData, SocialLink } from '../types';
import { ORGANIZATION_INFO, SOCIAL_LINKS } from '../constants';
import { account, databases, APPWRITE_CONFIG } from '../lib/appwrite';
import { ID } from 'appwrite';

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
  currentUser: any;
  isAuthModalOpen: boolean;
  isLoadingData: boolean;
  toggleEditMode: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateOrganization: (key: keyof ContentData['organization'], value: string) => void;
  updatePodcast: (key: keyof ContentData['podcast'], value: string) => void;
  addLink: (category: 'contact' | 'social') => void;
  removeLink: (id: string) => void;
  updateLink: (id: string, field: keyof SocialLink, value: string) => void;
  saveChanges: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentData>(DEFAULT_CONTENT);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. Check Session & Load Data on Mount
  useEffect(() => {
    checkSession();
    fetchContent();
  }, []);

  const checkSession = async () => {
    try {
      const user = await account.get();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  const fetchContent = async () => {
    setIsLoadingData(true);
    try {
      // Try to get the specific document
      const response = await databases.getDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_ID,
        APPWRITE_CONFIG.DOCUMENT_ID
      );

      // CHANGED: key updated to data_json
      if (response && response.data_json) {
        setContent(JSON.parse(response.data_json));
      }
    } catch (error) {
      console.log("Using default content or failed to fetch Appwrite:", error);
      // Fallback to localStorage if Appwrite fails (e.g. not configured yet)
      const saved = localStorage.getItem('site_content');
      if (saved) setContent(JSON.parse(saved));
    } finally {
      setIsLoadingData(false);
    }
  };

  // 2. Saving Logic (Push to Appwrite)
  const saveChanges = async () => {
    if (!currentUser) return; // Only allow save if logged in
    
    try {
      const jsonString = JSON.stringify(content);
      
      // Try to update existing document
      await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTION_ID,
        APPWRITE_CONFIG.DOCUMENT_ID,
        { data_json: jsonString }
      );
      
      // Also save to local storage as backup/cache
      localStorage.setItem('site_content', jsonString);
      alert("Perubahan tersimpan ke Server!");
    } catch (error: any) {
      console.error("Save failed", error);
      
      // Check for Fetch Error specifically
      if (error.message === "Failed to fetch") {
         alert("GAGAL MENYIMPAN: Koneksi ke server ditolak. Pastikan domain terdaftar di Appwrite Console > Platforms.");
         return;
      }

      // If document not found, try to create it (First time setup)
      if (error.code === 404) {
         try {
            await databases.createDocument(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTION_ID,
                APPWRITE_CONFIG.DOCUMENT_ID,
                { data_json: JSON.stringify(content) }
            );
            alert("Database diinisialisasi dan tersimpan!");
         } catch (createErr: any) {
             if (createErr.message === "Failed to fetch") {
                 alert("GAGAL MENYIMPAN: Koneksi ke server ditolak. Cek Appwrite Platforms.");
             } else {
                 alert("Gagal menyimpan. Pastikan Project ID, DB ID, dan Collection ID benar.");
             }
         }
      } else {
        alert("Gagal menyimpan perubahan. Error: " + error.message);
      }
    }
  };

  // 3. Auth Actions
  const login = async (email: string, pass: string) => {
    try {
      await account.createEmailPasswordSession(email, pass);
      await checkSession();
      setIsEditing(true); // Auto enable edit mode on login
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await account.deleteSession('current');
    setCurrentUser(null);
    setIsEditing(false);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const toggleEditMode = () => {
      if (!currentUser) {
          openAuthModal();
      } else {
          setIsEditing(prev => !prev);
      }
  };

  // 4. Content Modifiers
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
      currentUser,
      isAuthModalOpen,
      isLoadingData,
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