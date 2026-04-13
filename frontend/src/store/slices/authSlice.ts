import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthState } from '../../types'
import { authService, RegisterRequest } from '../../services/authService'

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password)
      localStorage.setItem('token', data.token)
      return data
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  },
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(data)
      localStorage.setItem('token', response.token)
      return response
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  },
)

export const fetchProfileThunk = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
