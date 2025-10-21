// API Configuration
// En producción, Nginx hace proxy_pass de /api/ a http://backend:3000/
// En desarrollo local, usar el puerto directo del backend
export const API_URL = import.meta.env.VITE_API_URL || (
    import.meta.env.MODE === 'production' 
        ? '/api'  // En producción: Nginx reverse proxy
        : 'http://localhost:3000'  // En desarrollo: backend directo
)

console.log('🔌 API URL configured:', API_URL, '| Mode:', import.meta.env.MODE)
