import { Link, useSearchParams } from 'react-router-dom'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Order ID: #{orderId}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderId && (
            <Link to={`/orders/${orderId}`} className="btn-primary px-8 py-3">
              View Order
            </Link>
          )}
          <Link to="/products" className="btn-secondary px-8 py-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
