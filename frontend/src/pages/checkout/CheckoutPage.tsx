import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchCart } from '../../store/slices/cartSlice'
import { createOrder } from '../../store/slices/orderSlice'
import { userService } from '../../services/userService'
import { paymentService } from '../../services/paymentService'
import { Address } from '../../types'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

interface AddressFormData {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

function CheckoutForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()

  const { cart } = useAppSelector((state) => state.cart)
  const { loading: orderLoading } = useAppSelector((state) => state.orders)

  const [step, setStep] = useState(1)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

  const [addressForm, setAddressForm] = useState<AddressFormData>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  })

  useEffect(() => {
    dispatch(fetchCart())
    userService.getAddresses().then((addrs) => {
      setAddresses(addrs)
      const def = addrs.find((a) => a.isDefault)
      if (def) setSelectedAddressId(def.id)
      else if (addrs.length === 0) setUseNewAddress(true)
    }).catch(() => setUseNewAddress(true))
  }, [dispatch])

  const handleAddressSubmit = () => {
    if (useNewAddress) {
      if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
        toast.error('Please fill all address fields')
        return
      }
    } else if (!selectedAddressId) {
      toast.error('Please select an address')
      return
    }
    setStep(2)
  }

  const handlePayment = async () => {
    if (!stripe || !elements) return
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    setProcessingPayment(true)
    try {
      let addrId = selectedAddressId
      if (useNewAddress) {
        const saved = await userService.addAddress(addressForm)
        addrId = saved.id
      }

      if (!addrId) {
        toast.error('No shipping address selected')
        setProcessingPayment(false)
        return
      }

      const order = await dispatch(createOrder({ shippingAddressId: addrId })).unwrap()

      const { clientSecret } = await paymentService.createPaymentIntent(order.id)

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      })

      if (result.error) {
        toast.error(result.error.message ?? 'Payment failed')
        navigate('/checkout/failed')
      } else {
        navigate(`/checkout/success?orderId=${order.id}`)
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      toast.error(error.message ?? 'Checkout failed')
      navigate('/checkout/failed')
    } finally {
      setProcessingPayment(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500 dark:text-gray-400">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {['Shipping', 'Review', 'Payment'].map((label, idx) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > idx + 1
                    ? 'bg-green-500 text-white'
                    : step === idx + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className={`text-xs mt-1 ${step === idx + 1 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {idx < 2 && <div className={`flex-1 h-1 mx-2 ${step > idx + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Shipping */}
      {step === 1 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Shipping Address</h2>

          {addresses.length > 0 && !useNewAddress && (
            <div className="space-y-3 mb-4">
              {addresses.map((addr) => (
                <label key={addr.id} className="flex items-start gap-3 cursor-pointer p-3 border rounded-lg border-gray-200 dark:border-gray-700 hover:border-indigo-400 transition-colors">
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{addr.street}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{addr.city}, {addr.state} {addr.zipCode}, {addr.country}</p>
                    {addr.isDefault && <span className="text-xs text-indigo-600 dark:text-indigo-400">Default</span>}
                  </div>
                </label>
              ))}
              <button
                onClick={() => setUseNewAddress(true)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 mt-2"
              >
                + Use a different address
              </button>
            </div>
          )}

          {(useNewAddress || addresses.length === 0) && (
            <div className="space-y-4">
              {addresses.length > 0 && (
                <button
                  onClick={() => setUseNewAddress(false)}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 mb-2"
                >
                  ← Use saved address
                </button>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                <input
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="input-field"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="input-field"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                  <input
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="input-field"
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                  <input
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    className="input-field"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                  <input
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="input-field"
                    placeholder="US"
                  />
                </div>
              </div>
            </div>
          )}

          <button onClick={handleAddressSubmit} className="btn-primary w-full py-3 mt-6">
            Continue to Review
          </button>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Order Review</h2>
          <div className="space-y-3 mb-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">${item.subtotal.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700 mb-6">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3">Continue to Payment</button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Payment Details</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card Information
            </label>
            <div className="input-field">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      '::placeholder': { color: '#9ca3af' },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
            <div className="flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Total to Pay</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          {orderLoading || processingPayment ? (
            <LoadingSpinner />
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1 py-3">← Back</button>
              <button onClick={handlePayment} className="btn-primary flex-1 py-3">
                Pay ${cart.totalPrice.toFixed(2)}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
