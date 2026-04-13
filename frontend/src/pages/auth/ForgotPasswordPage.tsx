import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
    toast.success('Password reset email sent!')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {submitted ? (
            <div className="text-center">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg p-4 mb-6">
                <p className="font-medium">Check your email</p>
                <p className="text-sm mt-1">
                  We sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
              <Link to="/login" className="btn-primary inline-block px-8">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <div className="text-center">
                <Link to="/login" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
