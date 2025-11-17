import { API_URL } from '../config/api'
import AuthService from './AuthService'

/**
 * Servicio centralizado para hacer peticiones HTTP con autenticación automática
 */

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /**
   * Método genérico para hacer peticiones HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, headers = {}, ...restOptions } = options

    // Preparar headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    }

    // Agregar token si la petición requiere autenticación
    if (requiresAuth) {
      const token = AuthService.getToken()
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`
      }
    }

    // Construir URL completa
    const url = `${this.baseURL}${endpoint}`
    
    // Debug: Log de la URL que se está usando
    console.log('🔗 Making request to:', url)
    console.log('📋 Headers:', requestHeaders)

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
      })

      // Manejar errores de autenticación (solo si requiere auth)
      if (response.status === 401 && requiresAuth) {
        AuthService.logout()
        localStorage.removeItem('user')
        // Usar router en lugar de window.location para evitar página en blanco
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('unauthorized'))
        }
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
      }

      // Manejar errores de autorización
      if (response.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción.')
      }

      // Manejar rate limiting
      if (response.status === 429) {
        throw new Error('Demasiadas peticiones. Por favor, espera un momento.')
      }

      // Manejar otros errores HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || `Error HTTP ${response.status}`
        throw new Error(errorMessage)
      }

      // Si la respuesta es 204 No Content, retornar null
      if (response.status === 204) {
        return null as T
      }

      // Parsear respuesta JSON
      return await response.json()
    } catch (error) {
      // Si es un error de red o fetch
      if (error instanceof TypeError) {
        console.error('Error de red:', error)
        throw new Error('Error de conexión. Verifica tu conexión a internet.')
      }
      
      // Re-lanzar otros errores
      throw error
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Exportar instancia singleton
export default new ApiService(API_URL)
