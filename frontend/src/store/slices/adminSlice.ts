import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AdminState, OrderStatus } from '../../types'
import { adminService, AdminParams } from '../../services/adminService'

const initialState: AdminState = {
  stats: null,
  users: [],
  allOrders: [],
  loading: false,
  error: null,
}

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getDashboardStats()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats')
    }
  },
)

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: AdminParams | undefined, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsers(params)
      return response.content
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
    }
  },
)

export const fetchAllOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (params: AdminParams | undefined, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllOrders(params)
      return response.content
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  },
)

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ id, role }: { id: number; role: 'ADMIN' | 'USER' }, { rejectWithValue }) => {
    try {
      return await adminService.updateUserRole(id, role)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role')
    }
  },
)

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ id, status }: { id: number; status: OrderStatus }, { rejectWithValue }) => {
    try {
      return await adminService.updateOrderStatus(id, status)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status')
    }
  },
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) state.users[idx] = action.payload
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.allOrders.findIndex((o) => o.id === action.payload.id)
        if (idx !== -1) state.allOrders[idx] = action.payload
      })
  },
})

export default adminSlice.reducer
