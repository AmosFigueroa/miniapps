import { LucideIcon } from 'lucide-react';

export interface SocialLink {
  id: string;
  title: string;
  url: string;
  iconName?: string; // Changed from icon object to string name for storage
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

// Global Content State Interface
export interface ContentData {
  organization: {
    name: string;
    tagline: string;
    description: string;
    headerImage: string; // URL for header image
  };
  podcast: {
    title: string;
    videoUrl: string; // Youtube URL
  };
  links: SocialLink[];
}

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