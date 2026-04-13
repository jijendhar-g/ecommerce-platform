import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CartState } from '../../types'
import { cartService } from '../../services/cartService'

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
}

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    return await cartService.getCart()
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
  }
})

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      return await cartService.addToCart(productId, quantity)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart')
    }
  },
)

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, quantity }: { itemId: number; quantity: number }, { rejectWithValue }) => {
    try {
      return await cartService.updateCartItem(itemId, quantity)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item')
    }
  },
)

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (itemId: number, { rejectWithValue }) => {
    try {
      return await cartService.removeFromCart(itemId)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      return rejectWithValue(error.response?.data?.message || 'Failed to remove cart item')
    }
  },
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.cart = null
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: CartState) => {
      state.loading = true
      state.error = null
    }
    const handleFulfilled = (state: CartState, action: { payload: CartState['cart'] }) => {
      state.loading = false
      state.cart = action.payload
    }
    const handleRejected = (state: CartState, action: { payload: unknown }) => {
      state.loading = false
      state.error = action.payload as string
    }

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, handleRejected)
      .addCase(updateCartItem.pending, handlePending)
      .addCase(updateCartItem.fulfilled, handleFulfilled)
      .addCase(updateCartItem.rejected, handleRejected)
      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleFulfilled)
      .addCase(removeFromCart.rejected, handleRejected)
  },
})

export const { clearCartState } = cartSlice.actions
export default cartSlice.reducer
