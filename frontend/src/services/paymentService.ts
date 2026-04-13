import api from './api'
import { Payment } from '../types'

export interface PaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

export const paymentService = {
  createPaymentIntent: async (orderId: number): Promise<PaymentIntentResponse> => {
    const response = await api.post<PaymentIntentResponse>(`/payments/create-intent`, { orderId })
    return response.data
  },

  confirmPayment: async (paymentIntentId: string): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/confirm`, { paymentIntentId })
    return response.data
  },

  getPaymentStatus: async (orderId: number): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/order/${orderId}`)
    return response.data
  },
}
