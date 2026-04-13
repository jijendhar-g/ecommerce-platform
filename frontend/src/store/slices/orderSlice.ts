import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { OrderState } from '../../types'
import { orderService, CreateOrderRequest } from '../../services/orderService'

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
}

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await orderService.getOrders()
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
  }
})

export const fetchOrder = createAsyncThunk(
  'orders/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      return await orderService.getOrder(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order')
    }
  },
)

export const createOrder = createAsyncThunk(
  'orders/create',
  async (data: CreateOrderRequest, { rejectWithValue }) => {
    try {
      return await orderService.createOrder(data)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to create order')
    }
  },
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
        state.orders = [action.payload, ...state.orders]
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default orderSlice.reducer
