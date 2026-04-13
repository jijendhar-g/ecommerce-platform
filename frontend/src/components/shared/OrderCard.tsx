import { Link } from 'react-router-dom'
import { Order } from '../../types'

interface OrderCardProps {
  order: Order
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  PROCESSING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  SHIPPED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  DELIVERED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

export default function OrderCard({ order }: OrderCardProps) {
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Order #</p>
          <p className="font-semibold text-gray-900 dark:text-white">{order.orderNumber}</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}
        >
          {order.status}
        </span>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span>📅 {date}</span>
        <span>🛍 {order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
        <span className="font-semibold text-gray-900 dark:text-white">
          Total: ${order.totalAmount.toFixed(2)}
        </span>
      </div>
      <Link
        to={`/orders/${order.id}`}
        className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
      >
        View Details →
      </Link>
    </div>
  )
}
