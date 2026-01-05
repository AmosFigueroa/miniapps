import { Client, Account, Databases } from 'appwrite';

// ========================================================
// KONFIGURASI APPWRITE
// ========================================================
export const APPWRITE_CONFIG = {
    // GUNAKAN ENDPOINT INI (Standard Appwrite Cloud)
    ENDPOINT: 'https://cloud.appwrite.io/v1', 
    
    // 1. Masukkan Project ID dari Appwrite Console di sini:
    PROJECT_ID: '695bbe6a003d32556e91', 
    
    // 2. Pastikan ID Database di Appwrite Console bernama 'org_portal_db'
    DATABASE_ID: 'org_portal_db', 
    
    // 3. Pastikan ID Collection di Appwrite Console bernama 'site_settings'
    COLLECTION_ID: 'site_settings', 
    
    // Jangan diubah
    DOCUMENT_ID: 'main_config' 
};

const client = new Client();

client
    .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
    .setProject(APPWRITE_CONFIG.PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export default client;