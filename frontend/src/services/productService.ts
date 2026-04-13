import api from './api'
import { Product, PaginatedResponse } from '../types'

export interface ProductParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  search?: string
}

export interface ProductInput {
  name?: string
  description?: string
  price?: number
  stockQuantity?: number
  imageUrl?: string
  category?: { id: number; name?: string; description?: string }
}

export const productService = {
  getProducts: async (params?: ProductParams): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params })
    return response.data
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  createProduct: async (data: ProductInput): Promise<Product> => {
    const response = await api.post<Product>('/products', data)
    return response.data
  },

  updateProduct: async (id: number, data: ProductInput): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data)
    return response.data
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`)
  },

  searchProducts: async (query: string, params?: ProductParams): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products/search', {
      params: { query, ...params },
    })
    return response.data
  },
}
