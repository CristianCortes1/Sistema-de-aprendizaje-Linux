import AuthService from './AuthService'
import { API_URL } from '../config/api'

export default {
  async create(payload: any) {
    const token = AuthService.getToken()
    const res = await fetch(`${API_URL}/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`HTTP ${res.status}: ${text}`)
    }

    return res.json()
  }
}
