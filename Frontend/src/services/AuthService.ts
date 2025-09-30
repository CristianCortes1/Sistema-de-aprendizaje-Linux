import { ref } from 'vue'

class AuthService {
    private tokenKey = 'token'
    public isLogged = ref(!!localStorage.getItem(this.tokenKey))

    setToken(token: string) {
        localStorage.setItem(this.tokenKey, token)
        this.isLogged.value = true
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey)
    }

    logout() {
        localStorage.removeItem(this.tokenKey)
        this.isLogged.value = false
    }

    isAuthenticated(): boolean {
        return this.isLogged.value
    }
}

export default new AuthService()
