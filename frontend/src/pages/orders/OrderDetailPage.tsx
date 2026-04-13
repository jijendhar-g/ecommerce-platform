import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchOrder } from '../../store/slices/orderSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ErrorMessage from '../../components/shared/ErrorMessage'
import { OrderStatus } from '../../types'

const STEPS: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  PROCESSING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  SHIPPED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { currentOrder, loading, error } = useAppSelector((state) => state.orders)

  useEffect(() => {
    if (id) dispatch(fetchOrder(Number(id)))
  }, [dispatch, id])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="max-w-4xl mx-auto px-4 py-10"><ErrorMessage message={error} /></div>
  if (!currentOrder) return null

  const stepIndex = STEPS.indexOf(currentOrder.status as OrderStatus)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order #{currentOrder.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[currentOrder.status]}`}>
          {currentOrder.status}
        </span>
      </div>

      {/* Status timeline */}
      {currentOrder.status !== 'CANCELLED' && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Progress</h2>
          <div className="flex items-center">
            {STEPS.map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx <= stepIndex
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {idx < stepIndex ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs mt-1 whitespace-nowrap ${idx <= stepIndex ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${idx < stepIndex ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
        <div className="space-y-4">
          {currentOrder.items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-xl">📦</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
          <div className="flex justify-between font-bold text-gray-900 dark:text-white text-lg">
            <span>Total</span>
            <span>${currentOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Shipping Address</h3>
          <address className="not-italic text-gray-600 dark:text-gray-400 text-sm space-y-1">
            <p>{currentOrder.shippingAddress.street}</p>
            <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}</p>
            <p>{currentOrder.shippingAddress.country}</p>
          </address>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Info</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>Status: <span className={`font-medium ${currentOrder.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>{currentOrder.paymentStatus}</span></p>
            <p>Amount: <span className="font-medium text-gray-900 dark:text-white">${currentOrder.totalAmount.toFixed(2)}</span></p>
          </div>
        </div>
      </div>

      <Link to="/orders" className="btn-secondary inline-flex items-center gap-2">
        ← Back to Orders
      </Link>
    </div>
  )
}
