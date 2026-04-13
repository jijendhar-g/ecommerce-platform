import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/adminSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { OrderStatus } from '../../types'
import { toast } from 'react-toastify'

const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  PROCESSING: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  SHIPPED: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  DELIVERED: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  CANCELLED: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
}

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch()
  const { allOrders, loading } = useAppSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAllOrders(undefined))
  }, [dispatch])

  const handleStatusChange = (id: number, status: OrderStatus) => {
    dispatch(updateOrderStatus({ id, status }))
      .unwrap()
      .then(() => toast.success('Order status updated'))
      .catch(() => toast.error('Failed to update order status'))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">All Orders</h1>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Order #</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Items</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Total</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Payment</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {allOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{order.orderNumber}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.items.length}</td>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer ${statusColors[order.status] ?? ''}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">No orders found</div>
        )}
      </div>
    </div>
  )
}
