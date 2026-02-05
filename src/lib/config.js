// Google API Configuration
// Values are loaded from environment variables (see .env.example)

export const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
export const SCOPES = [
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file'
];
