import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchProduct } from '../../store/slices/productSlice'
import { addToCart } from '../../store/slices/cartSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ErrorMessage from '../../components/shared/ErrorMessage'
import StarRating from '../../components/shared/StarRating'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { Review } from '../../types'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { currentProduct, loading, error } = useAppSelector((state) => state.products)
  const { token } = useAppSelector((state) => state.auth)

  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(Number(id)))
      api.get<Review[]>(`/products/${id}/reviews`).then((r) => setReviews(r.data)).catch(() => {})
    }
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (!token) {
      toast.info('Please login to add items to cart')
      navigate('/login')
      return
    }
    if (!currentProduct) return
    dispatch(addToCart({ productId: currentProduct.id, quantity }))
      .unwrap()
      .then(() => toast.success(`${currentProduct.name} added to cart!`))
      .catch((err: string) => toast.error(err))
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="max-w-7xl mx-auto px-4 py-10"><ErrorMessage message={error} /></div>
  if (!currentProduct) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Image */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-96 flex items-center justify-center overflow-hidden">
          {currentProduct.imageUrl ? (
            <img src={currentProduct.imageUrl} alt={currentProduct.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="mt-2">No image available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">
            {currentProduct.category.name}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{currentProduct.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={currentProduct.averageRating} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentProduct.averageRating.toFixed(1)} ({currentProduct.reviewCount} reviews)
            </span>
          </div>

          <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
            ${currentProduct.price.toFixed(2)}
          </p>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{currentProduct.description}</p>

          <div className="flex items-center gap-2 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentProduct.stockQuantity > 0
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}
            >
              {currentProduct.stockQuantity > 0
                ? `${currentProduct.stockQuantity} in stock`
                : 'Out of stock'}
            </span>
          </div>

          {/* Quantity selector */}
          {currentProduct.stockQuantity > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentProduct.stockQuantity, quantity + 1))}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={currentProduct.stockQuantity === 0}
            className="btn-primary py-4 text-lg"
          >
            {currentProduct.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
