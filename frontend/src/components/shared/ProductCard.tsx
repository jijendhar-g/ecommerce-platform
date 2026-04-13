import { Link } from 'react-router-dom'
import { Product } from '../../types'
import StarRating from './StarRating'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="card flex flex-col h-full">
      <div className="bg-gray-100 dark:bg-gray-700 h-48 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs mt-1">No image</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-1">
          {product.category.name}
        </span>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={product.averageRating} />
          <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            ${product.price.toFixed(2)}
          </span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.stockQuantity > 0
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 text-center btn-secondary text-sm py-1.5"
          >
            View Details
          </Link>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stockQuantity === 0}
            className="flex-1 btn-primary text-sm py-1.5"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
