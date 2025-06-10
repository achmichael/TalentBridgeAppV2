
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

console.log('EXPO_PUBLIC_API_URL:', apiUrl);

export const baseUrl = apiUrl || 'http://localhost:3000';

console.log('Using baseUrl:', baseUrl);

export const domainUrl = process.env.EXPO_DOMAIN_URL;

console.log('EXPO_DOMAIN_URL:', domainUrl);