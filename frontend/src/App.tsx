import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store'
import { fetchProfileThunk } from './store/slices/authSlice'
import { fetchCart } from './store/slices/cartSlice'

import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import ProtectedRoute from './components/shared/ProtectedRoute'
import AdminRoute from './components/shared/AdminRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ProductListPage from './pages/products/ProductListPage'
import ProductDetailPage from './pages/products/ProductDetailPage'
import CartPage from './pages/cart/CartPage'
import OrderHistoryPage from './pages/orders/OrderHistoryPage'
import OrderDetailPage from './pages/orders/OrderDetailPage'
import CheckoutPage from './pages/checkout/CheckoutPage'
import PaymentSuccessPage from './pages/checkout/PaymentSuccessPage'
import PaymentFailedPage from './pages/checkout/PaymentFailedPage'
import ProfilePage from './pages/profile/ProfilePage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'

export default function App() {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(fetchProfileThunk())
      dispatch(fetchCart())
    }
  }, [dispatch, token])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/success"
            element={
              <ProtectedRoute>
                <PaymentSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/failed"
            element={
              <ProtectedRoute>
                <PaymentFailedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrdersPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
