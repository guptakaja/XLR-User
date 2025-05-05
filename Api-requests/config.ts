// src/config.ts

const PROD_API_URL = 'https://xlr-ai.com';

const config = {
  API_DOMAIN_URL: PROD_API_URL,
  SOCKET_IO_URL: PROD_API_URL,
  GOOGLE_API_KEY: 'AIzaSyA9LQIZrsAqgJ4HTa3SLRB9eeoDc45Vy8o',
  ENV: 'production',
  userCookie: 'userToken',
};

export default config;

// ✅ This is needed for your API call file
export const origin = PROD_API_URL;
