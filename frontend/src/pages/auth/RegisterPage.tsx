import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { registerThunk } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [validationError, setValidationError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = (): boolean => {
    if (!form.firstName.trim()) { setValidationError('First name is required'); return false }
    if (!form.lastName.trim()) { setValidationError('Last name is required'); return false }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setValidationError('Valid email is required'); return false
    }
    if (form.password.length < 6) { setValidationError('Password must be at least 6 characters'); return false }
    if (form.password !== form.confirmPassword) { setValidationError('Passwords do not match'); return false }
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setValidationError('')
    if (!validate()) return

    const result = await dispatch(registerThunk({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    }))

    if (registerThunk.fulfilled.match(result)) {
      toast.success('Account created successfully!')
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Start shopping today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(validationError || error) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 text-sm">
                {validationError || error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-2">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
