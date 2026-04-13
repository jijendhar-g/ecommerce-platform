import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { loginThunk } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!email.trim()) {
      setValidationError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email address')
      return
    }
    if (!password) {
      setValidationError('Password is required')
      return
    }

    const result = await dispatch(loginThunk({ email, password }))
    if (loginThunk.fulfilled.match(result)) {
      toast.success('Welcome back!')
      navigate('/')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">SE</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(validationError || error) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 text-sm">
                {validationError || error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? <LoadingSpinner /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
