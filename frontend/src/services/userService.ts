import api from './api'
import { Address } from '../types'

export type AddressInput = Omit<Address, 'id' | 'isDefault'>

export const userService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get<Address[]>('/users/addresses')
    return response.data
  },

  addAddress: async (data: AddressInput): Promise<Address> => {
    const response = await api.post<Address>('/users/addresses', data)
    return response.data
  },

  updateAddress: async (id: number, data: AddressInput): Promise<Address> => {
    const response = await api.put<Address>(`/users/addresses/${id}`, data)
    return response.data
  },

  deleteAddress: async (id: number): Promise<void> => {
    await api.delete(`/users/addresses/${id}`)
  },

  setDefaultAddress: async (id: number): Promise<Address> => {
    const response = await api.put<Address>(`/users/addresses/${id}/default`)
    return response.data
  },
}
