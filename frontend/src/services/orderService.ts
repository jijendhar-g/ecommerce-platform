import api from './api'
import { Order, OrderStatus } from '../types'
import { Address } from '../types'

export interface CreateOrderRequest {
  shippingAddressId: number
  items?: { productId: number; quantity: number }[]
}

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>('/orders', data)
    return response.data
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders')
    return response.data
  },

  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`)
    return response.data
  },

  cancelOrder: async (id: number): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/cancel`)
    return response.data
  },
}

export type { Address, OrderStatus }
