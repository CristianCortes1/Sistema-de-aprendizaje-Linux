import { ref } from 'vue'
import ApiService from './ApiService'

const tokenKey = 'token'
const isLogged = ref(!!localStorage.getItem(tokenKey))

function setToken(token: string) {
    localStorage.setItem(tokenKey, token)
    isLogged.value = true
}

function getToken(): string | null {
    return localStorage.getItem(tokenKey)
}

function getUserId(): string | null {
    const token = getToken()
    if (!token) {
        // ❌ Sin token = sin acceso
        return null
    }

    try {
        // Decodificar el JWT (payload está en la segunda parte)
        const parts = token.split('.')
        if (parts.length !== 3) return null
        
        const payload = JSON.parse(atob(parts[1]))
        return payload.sub || payload.userId || payload.id || null
    } catch (error) {
        console.error('Error decoding token:', error)
        return null
    }
}

function logout() {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem('user')
    isLogged.value = false
}

function isAuthenticated(): boolean {
    return isLogged.value
}

// Funciones de API de autenticación
async function login(username: string, password: string) {
    return ApiService.post<{ access_token: string; user: any }>(
        '/auth/login',
        { username, password },
        { requiresAuth: false }
    )
}

async function register(username: string, correo: string, password: string) {
    return ApiService.post(
        '/auth/register',
        { username, correo, password },
        { requiresAuth: false }
    )
}

async function confirmEmail(token: string) {
    return ApiService.get(`/auth/confirm-email?token=${token}`, { requiresAuth: false })
}

async function forgotPassword(email: string) {
    return ApiService.post('/auth/forgot-password', { email }, { requiresAuth: false })
}

async function resetPassword(token: string, newPassword: string) {
    return ApiService.post(
        '/auth/reset-password',
        { token, newPassword },
        { requiresAuth: false }
    )
}

async function changePassword(email: string, currentPassword: string, newPassword: string) {
    return ApiService.post('/auth/change-password', {
        email,
        currentPassword,
        newPassword
    })
}

export default {
    setToken,
    getToken,
    getUserId,
    logout,
    isAuthenticated,
    isLogged,
    login,
    register,
    confirmEmail,
    forgotPassword,
    resetPassword,
    changePassword
}
