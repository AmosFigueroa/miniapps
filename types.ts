import { LucideIcon } from 'lucide-react';

export interface SocialLink {
  id: string;
  title: string;
  url: string;
  iconName?: string;
  category: 'contact' | 'social';
  highlight?: boolean;
}

export interface OrgEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  status: 'upcoming' | 'past' | 'ongoing';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// New Interface for User Customizable Theme
export interface ThemeSettings {
  background: string;     // Warna Latar Belakang Halaman
  cardBackground: string; // Warna Latar Kotak (Judul/Links)
  textMain: string;       // Warna Teks Utama
  primaryButton: string;  // Warna Tombol Utama (Linktree)
  buttonText: string;     // Warna Teks di dalam Tombol
  accent: string;         // Warna Shadow/Garis/Highlight
  navbar: string;         // Warna Navbar
}

// Global Content State Interface
export interface ContentData {
  organization: {
    name: string;
    tagline: string;
    description: string;
    headerImage: string;
    sectionTitle: string; // Added editable section title
  };
  podcast: {
    title: string;
    videoUrl: string;
  };
  links: SocialLink[];
  theme: ThemeSettings; // Added theme property
}

// Deprecated but kept for type safety in other files until refactored
export interface ThemeConfig {
  colors: {
    primary: string;    
    secondary: string;  
    accent: string;     
    background: string; 
    surface: string;    
    textMain: string;   
    textLight: string;  
  }
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  message: string;
  type: ToastType;
  isVisible: boolean;
}