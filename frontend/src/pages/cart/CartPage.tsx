import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchCart, updateCartItem, removeFromCart } from '../../store/slices/cartSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ErrorMessage from '../../components/shared/ErrorMessage'
import { toast } from 'react-toastify'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const { cart, loading, error } = useAppSelector((state) => state.cart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleUpdateQty = (itemId: number, quantity: number) => {
    if (quantity < 1) return
    dispatch(updateCartItem({ itemId, quantity }))
      .unwrap()
      .catch((err: string) => toast.error(err))
  }

  const handleRemove = (itemId: number) => {
    dispatch(removeFromCart(itemId))
      .unwrap()
      .then(() => toast.success('Item removed'))
      .catch((err: string) => toast.error(err))
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="max-w-4xl mx-auto px-4 py-10"><ErrorMessage message={error} /></div>

  const isEmpty = !cart || cart.items.length === 0

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

      {isEmpty ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add some products to get started!</p>
          <Link to="/products" className="btn-primary px-8">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="card p-4 flex gap-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.product.category.name}</p>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">${item.subtotal.toFixed(2)}</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Items ({cart.itemCount})</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400">Free</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-primary w-full text-center block py-3">
                Proceed to Checkout
              </Link>
              <Link to="/products" className="btn-secondary w-full text-center block py-3 mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
