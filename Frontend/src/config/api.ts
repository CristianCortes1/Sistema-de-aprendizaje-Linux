// API Configuration
// En build time, Vite reemplaza import.meta.env.VITE_API_URL con el valor real
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

console.log('🔌 API URL configured:', API_URL)
