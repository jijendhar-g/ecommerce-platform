import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchOrders } from '../../store/slices/orderSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ErrorMessage from '../../components/shared/ErrorMessage'
import OrderCard from '../../components/shared/OrderCard'

export default function OrderHistoryPage() {
  const dispatch = useAppDispatch()
  const { orders, loading, error } = useAppSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="max-w-4xl mx-auto px-4 py-10"><ErrorMessage message={error} /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No orders yet</h2>
          <p className="text-gray-500 dark:text-gray-400">Start shopping to see your orders here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
