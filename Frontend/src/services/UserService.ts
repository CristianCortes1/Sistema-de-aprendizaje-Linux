import ApiService from './ApiService'

export default {
  async getAll() {
    return ApiService.get('/users')
  },

  async getById(id: number) {
    return ApiService.get(`/users/${id}`)
  },

  async getRanking() {
    return ApiService.get('/users/ranking', { requiresAuth: false })
  },

  async create(userData: any) {
    return ApiService.post('/users', userData)
  },

  async update(id: number, userData: any) {
    return ApiService.patch(`/users/${id}`, userData)
  },

  async delete(id: number) {
    return ApiService.delete(`/users/${id}`)
  }
}
