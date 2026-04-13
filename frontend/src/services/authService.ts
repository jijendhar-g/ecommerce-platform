import api from './api'
import { User } from '../types'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password })
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile')
    return response.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/auth/profile', data)
    return response.data
  },
}
