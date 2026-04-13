import api from './api'
import { User, Order, AdminStats, OrderStatus } from '../types'
import { PaginatedResponse } from '../types'

export interface AdminParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}

export const adminService = {
  getDashboardStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>('/admin/stats')
    return response.data
  },

  getUsers: async (params?: AdminParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/admin/users', { params })
    return response.data
  },

  updateUserRole: async (id: number, role: 'ADMIN' | 'USER'): Promise<User> => {
    const response = await api.put<User>(`/admin/users/${id}/role`, { role })
    return response.data
  },

  getAllOrders: async (params?: AdminParams): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/admin/orders', { params })
    return response.data
  },

  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order> => {
    const response = await api.put<Order>(`/admin/orders/${id}/status`, { status })
    return response.data
  },
}
