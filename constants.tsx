import { SocialLink, OrgEvent, ThemeConfig } from './types';

// ==========================================
// 🎨 PALETTE CONFIGURATION
// ==========================================
export const THEME: ThemeConfig = {
  colors: {
    primary: '#102C57',    // Deep Navy Blue (Profesional & Sesuai Logo)
    secondary: '#102C57',  // Matching Primary
    accent: '#FFC300',     // Golden Yellow (Warna Khas UPY/Bisnis)
    background: '#F8F9FA', // Clean Gray-White
    surface: '#ffffff',    // White
    textMain: '#102C57',   // Navy Text for readability
    textLight: '#ffffff'   // White Text
  }
};

export const ORGANIZATION_INFO = {
  name: "",
  tagline: "",
  description: "",
  systemInstruction: "You are the AI assistant for HMP Bisnis Digital UPY (Himpunan Mahasiswa Program Studi Bisnis Digital Universitas PGRI Yogyakarta), specifically for 'Kabinet 4.0'. Your role is to help students and partners connect with the organization. Use a friendly, youthful, and professional tone."
};

export const SOCIAL_LINKS: SocialLink[] = [];

export const UPCOMING_EVENTS: OrgEvent[] = [];