import ApiService from './ApiService'

export default {
  async create(progressData: { userId: number; lessonId: number; progress: number }) {
    return ApiService.post('/progress', progressData)
  },

  async getByUserAndLesson(userId: number, lessonId: number) {
    return ApiService.get(`/progress?userId=${userId}&lessonId=${lessonId}`)
  },

  async update(id: number, progressData: any) {
    return ApiService.patch(`/progress/${id}`, progressData)
  },

  async getAll() {
    return ApiService.get('/progress')
  }
}
