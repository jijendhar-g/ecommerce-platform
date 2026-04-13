import { useState, useEffect, FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchOrders } from '../../store/slices/orderSlice'
import { authService } from '../../services/authService'
import { userService } from '../../services/userService'
import { Address } from '../../types'
import OrderCard from '../../components/shared/OrderCard'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { toast } from 'react-toastify'

type Tab = 'profile' | 'addresses' | 'orders'

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { orders, loading: ordersLoading } = useAppSelector((state) => state.orders)

  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
  })
  const [profileLoading, setProfileLoading] = useState(false)

  const [addresses, setAddresses] = useState<Address[]>([])
  const [addrLoading, setAddrLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addrForm, setAddrForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  })

  useEffect(() => {
    if (activeTab === 'orders') dispatch(fetchOrders())
    if (activeTab === 'addresses') loadAddresses()
  }, [activeTab, dispatch])

  const loadAddresses = async () => {
    setAddrLoading(true)
    try {
      const data = await userService.getAddresses()
      setAddresses(data)
    } catch {
      toast.error('Failed to load addresses')
    } finally {
      setAddrLoading(false)
    }
  }

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      await authService.updateProfile(profileForm)
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const openAddressForm = (addr?: Address) => {
    if (addr) {
      setEditingAddress(addr)
      setAddrForm({ street: addr.street, city: addr.city, state: addr.state, zipCode: addr.zipCode, country: addr.country })
    } else {
      setEditingAddress(null)
      setAddrForm({ street: '', city: '', state: '', zipCode: '', country: 'US' })
    }
    setShowAddressForm(true)
  }

  const handleAddrSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (editingAddress) {
        const updated = await userService.updateAddress(editingAddress.id, addrForm)
        setAddresses(addresses.map((a) => (a.id === updated.id ? updated : a)))
        toast.success('Address updated')
      } else {
        const created = await userService.addAddress(addrForm)
        setAddresses([...addresses, created])
        toast.success('Address added')
      }
      setShowAddressForm(false)
    } catch {
      toast.error('Failed to save address')
    }
  }

  const handleDeleteAddress = async (id: number) => {
    try {
      await userService.deleteAddress(id)
      setAddresses(addresses.filter((a) => a.id !== id))
      toast.success('Address deleted')
    } catch {
      toast.error('Failed to delete address')
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const updated = await userService.setDefaultAddress(id)
      setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === updated.id })))
      toast.success('Default address updated')
    } catch {
      toast.error('Failed to set default address')
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Personal Info' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'orders', label: 'Order History' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-px bg-white dark:bg-gray-900'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6 max-w-lg">
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <input value={user?.role ?? ''} disabled className="input-field opacity-60 cursor-not-allowed" />
            </div>
            <button type="submit" disabled={profileLoading} className="btn-primary w-full py-3">
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div>
          {addrLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{addr.street}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{addr.city}, {addr.state} {addr.zipCode}, {addr.country}</p>
                      {addr.isDefault && (
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(addr.id)} className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg">
                          Set Default
                        </button>
                      )}
                      <button onClick={() => openAddressForm(addr)} className="text-sm btn-secondary px-3 py-1">Edit</button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm btn-danger px-3 py-1">Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {!showAddressForm && (
                <button onClick={() => openAddressForm()} className="btn-primary px-6">
                  + Add New Address
                </button>
              )}

              {showAddressForm && (
                <div className="card p-6 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <form onSubmit={handleAddrSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street</label>
                      <input value={addrForm.street} onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })} className="input-field" placeholder="123 Main St" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                        <input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="input-field" placeholder="New York" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                        <input value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="input-field" placeholder="NY" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                        <input value={addrForm.zipCode} onChange={(e) => setAddrForm({ ...addrForm, zipCode: e.target.value })} className="input-field" placeholder="10001" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                        <input value={addrForm.country} onChange={(e) => setAddrForm({ ...addrForm, country: e.target.value })} className="input-field" placeholder="US" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary px-6">Save Address</button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary px-6">Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {ordersLoading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
