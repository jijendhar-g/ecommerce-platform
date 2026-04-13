import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchProducts } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import ProductCard from '../components/shared/ProductCard'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { Product } from '../types'
import { toast } from 'react-toastify'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector((state) => state.products)
  const { token } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchProducts({ size: 8 }))
  }, [dispatch])

  const handleAddToCart = (product: Product) => {
    if (!token) {
      toast.info('Please login to add items to cart')
      return
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success(`${product.name} added to cart!`))
      .catch((err: string) => toast.error(err))
  }

  const categories = [
    { name: 'Electronics', icon: '💻', color: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Clothing', icon: '👕', color: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Home & Garden', icon: '🏡', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { name: 'Sports', icon: '⚽', color: 'bg-red-100 dark:bg-red-900/30' },
    { name: 'Books', icon: '📚', color: 'bg-purple-100 dark:bg-purple-900/30' },
    { name: 'Beauty', icon: '💄', color: 'bg-pink-100 dark:bg-pink-900/30' },
  ]

  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Discover Amazing Products at Great Prices
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8">
              Shop from thousands of quality products with fast shipping and easy returns.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-indigo-50 dark:bg-indigo-900/20 border-y border-indigo-100 dark:border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🚚', title: 'Free Shipping', sub: 'On orders over $50' },
              { icon: '↩️', title: 'Easy Returns', sub: '30-day return policy' },
              { icon: '🔒', title: 'Secure Payment', sub: 'SSL encrypted checkout' },
              { icon: '💬', title: '24/7 Support', sub: 'Always here to help' },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{f.icon}</span>
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?search=${encodeURIComponent(cat.name)}`}
              className={`${cat.color} rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 transition-colors"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No products available yet. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  )
}
