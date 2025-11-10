import { ref } from 'vue';
const tokenKey = 'token';
const isLogged = ref(!!localStorage.getItem(tokenKey));
function setToken(token) {
    localStorage.setItem(tokenKey, token);
    isLogged.value = true;
}
function getToken() {
    return localStorage.getItem(tokenKey);
}
function getUserId() {
    const token = getToken();
    if (!token) {
        // ❌ Sin token = sin acceso
        return null;
    }
    try {
        // Decodificar el JWT (payload está en la segunda parte)
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload.sub || payload.userId || payload.id || null;
    }
    catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}
function logout() {
    localStorage.removeItem(tokenKey);
    isLogged.value = false;
}
function isAuthenticated() {
    return isLogged.value;
}
export default {
    setToken,
    getToken,
    getUserId,
    logout,
    isAuthenticated,
    isLogged
};
