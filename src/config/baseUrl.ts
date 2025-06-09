// Pastikan environment variable ada, jika tidak, gunakan fallback URL lokal
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Log nilai untuk debugging
console.log('EXPO_PUBLIC_API_URL:', apiUrl);

// Gunakan nilai default jika environment variable tidak ada
export const baseUrl = apiUrl || 'http://localhost:3000';

// Untuk debugging
console.log('Using baseUrl:', baseUrl);