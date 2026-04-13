import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ProductState, ProductFilters } from '../../types'
import { productService, ProductParams } from '../../services/productService'

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {},
  pagination: { page: 0, size: 12, totalElements: 0, totalPages: 0 },
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: ProductParams | undefined, { rejectWithValue }) => {
    try {
      return await productService.getProducts(params)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  },
)

export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      return await productService.getProduct(id)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
    }
  },
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.content
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true
        state.error = null
        state.currentProduct = null
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setFilters, clearFilters } = productSlice.actions
export default productSlice.reducer
