import { ref } from 'vue';
class AuthService {
    tokenKey = 'token';
    isLogged = ref(!!localStorage.getItem(this.tokenKey));
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
        this.isLogged.value = true;
    }
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
    logout() {
        localStorage.removeItem(this.tokenKey);
        this.isLogged.value = false;
    }
    isAuthenticated() {
        return this.isLogged.value;
    }
}
export default new AuthService();
