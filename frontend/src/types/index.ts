export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'USER'
  createdAt: string
}

export interface Category {
  id: number
  name: string
  description: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  category: Category
  imageUrl?: string
  averageRating: number
  reviewCount: number
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
  subtotal: number
}

export interface Cart {
  id: number
  items: CartItem[]
  totalPrice: number
  itemCount: number
}

export interface Address {
  id: number
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface OrderItem {
  id: number
  product: Product
  quantity: number
  price: number
}

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface Order {
  id: number
  orderNumber: string
  items: OrderItem[]
  status: OrderStatus
  totalAmount: number
  shippingAddress: Address
  createdAt: string
  paymentStatus: PaymentStatus
}

export interface Payment {
  id: number
  orderId: number
  amount: number
  status: PaymentStatus
  stripePaymentIntentId: string
}

export interface Review {
  id: number
  productId: number
  userId: number
  rating: number
  comment: string
  createdAt: string
}

// Redux state types
export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export interface ProductFilters {
  search?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface Pagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ProductState {
  products: Product[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
  filters: ProductFilters
  pagination: Pagination
}

export interface CartState {
  cart: Cart | null
  loading: boolean
  error: string | null
}

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
}

export interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  revenueByMonth: { month: string; revenue: number }[]
  ordersByStatus: { status: string; count: number }[]
}

export interface AdminState {
  stats: AdminStats | null
  users: User[]
  allOrders: Order[]
  loading: boolean
  error: string | null
}

// API response types
export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
