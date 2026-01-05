import { SocialLink, OrgEvent, ThemeConfig } from './types';

// ==========================================
// 🎨 PALETTE CONFIGURATION
// ==========================================
export const THEME: ThemeConfig = {
  colors: {
    primary: '#2B427A',    // Dark Blue
    secondary: '#2B427A',  // Dark Blue for buttons to match screenshot
    accent: '#DFFF00',     // Neon Yellow for highlights
    background: '#f8fafc', // Light Gray
    surface: '#ffffff',    // White
    textMain: '#2B427A',   // Dark Blue Text
    textLight: '#ffffff'   // White Text
  }
};

export const ORGANIZATION_INFO = {
  name: "HMP Bisnis Digital UPY",
  tagline: "Kabinet 4.0",
  description: "Wadah pengembangan mahasiswa Bisnis Digital UPY yang kreatif, inovatif, dan kolaboratif.",
  systemInstruction: "You are the AI assistant for HMP Bisnis Digital UPY (Himpunan Mahasiswa Program Studi Bisnis Digital Universitas PGRI Yogyakarta), specifically for 'Kabinet 4.0'. Your role is to help students and partners connect with the organization. Use a friendly, youthful, and professional tone."
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'admin1',
    title: 'Admin 1',
    url: 'https://wa.me/6281234567890',
    iconName: 'Phone',
    category: 'contact',
    highlight: true
  },
  {
    id: 'admin2',
    title: 'Admin 2',
    url: 'https://wa.me/6281234567890',
    iconName: 'Phone',
    category: 'contact',
    highlight: true
  },
  {
    id: 'ig',
    title: 'Instagram',
    url: 'https://instagram.com',
    iconName: 'Instagram',
    category: 'social'
  },
  {
    id: 'tiktok',
    title: 'TikTok',
    url: 'https://tiktok.com',
    iconName: 'Music', // Using Music icon as fallback for TikTok
    category: 'social'
  },
  {
    id: 'yt',
    title: 'YouTube',
    url: 'https://youtube.com',
    iconName: 'Youtube',
    category: 'social'
  }
];

export const UPCOMING_EVENTS: OrgEvent[] = [
  // Keeping these as backup/extra content if needed, though main focus is now the profile
  {
    id: 'e1',
    title: 'Digital Leadership Summit',
    date: '2024-11-15',
    time: '09:00 WIB',
    location: 'Auditorium UPY',
    description: 'Seminar kepemimpinan era digital.',
    image: 'https://picsum.photos/800/400?random=1',
    status: 'upcoming'
  }
];