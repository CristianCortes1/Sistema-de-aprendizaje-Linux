import { ref } from 'vue'

const tokenKey = 'token'
const guestIdKey = 'guestId'
const isLogged = ref(!!localStorage.getItem(tokenKey))

function getOrCreateGuestId(): string {
    // Verificar si ya existe un guestId en localStorage
    let guestId = localStorage.getItem(guestIdKey)
    
    if (!guestId) {
        // Crear un nuevo guestId único
        guestId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem(guestIdKey, guestId)
        console.log('Created new guest ID:', guestId)
    }
    
    return guestId
}

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
        // Si no hay token, generar o recuperar un guestId persistente
        return getOrCreateGuestId()
    }

    try {
        // Decodificar el JWT (payload está en la segunda parte)
        const parts = token.split('.')
        if (parts.length !== 3) return getOrCreateGuestId()
        
        const payload = JSON.parse(atob(parts[1]))
        return payload.sub || payload.userId || payload.id || getOrCreateGuestId()
    } catch (error) {
        console.error('Error decoding token:', error)
        return getOrCreateGuestId()
    }
}

function logout() {
    localStorage.removeItem(tokenKey)
    // NO eliminar el guestId para mantener la persistencia
    isLogged.value = false
}

function clearGuestId() {
    // Método opcional para limpiar el guestId si es necesario
    localStorage.removeItem(guestIdKey)
}

function isAuthenticated(): boolean {
    return isLogged.value
}

export default {
    setToken,
    getToken,
    getUserId,
    logout,
    clearGuestId,
    isAuthenticated,
    isLogged
}

