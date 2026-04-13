import { Link } from 'react-router-dom'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Payment Failed</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We were unable to process your payment. Please check your card details and try again, or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/checkout" className="btn-primary px-8 py-3">
            Try Again
          </Link>
          <Link to="/cart" className="btn-secondary px-8 py-3">
            Back to Cart
          </Link>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Need help?{' '}
          <a href="mailto:support@shopease.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}
