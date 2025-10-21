import AuthService from './AuthService';
const API_BASE = 'https://sistema-de-aprendizaje-linux-production.up.railway.app';
export default {
    async create(payload) {
        const token = AuthService.getToken();
        const res = await fetch(`${API_BASE}/lessons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
    }
};
