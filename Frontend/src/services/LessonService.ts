import ApiService from './ApiService'

export default {
  async create(payload: any) {
    return ApiService.post('/lessons', payload)
  },

  async getAll() {
    return ApiService.get('/lessons', { requiresAuth: false })
  },

  async getById(id: number) {
    return ApiService.get(`/lessons/${id}`, { requiresAuth: false })
  },

  async getAvailableForUser(userId: number) {
    return ApiService.get(`/lessons/user/${userId}/available`)
  },

  async update(id: number, payload: any) {
    return ApiService.patch(`/lessons/${id}`, payload)
  },

  async delete(id: number) {
    return ApiService.delete(`/lessons/${id}`)
  }
}
