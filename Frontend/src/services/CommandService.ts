import ApiService from './ApiService'

export default {
  async getAll() {
    return ApiService.get('/commands', { requiresAuth: false })
  },

  async getById(id: number) {
    return ApiService.get(`/commands/${id}`, { requiresAuth: false })
  },

  async create(commandData: any) {
    return ApiService.post('/commands', commandData)
  },

  async update(id: number, commandData: any) {
    return ApiService.patch(`/commands/${id}`, commandData)
  },

  async delete(id: number) {
    return ApiService.delete(`/commands/${id}`)
  }
}
