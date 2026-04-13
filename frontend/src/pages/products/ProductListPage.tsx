import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchProducts, setFilters } from '../../store/slices/productSlice'
import { addToCart } from '../../store/slices/cartSlice'
import ProductCard from '../../components/shared/ProductCard'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import Pagination from '../../components/shared/Pagination'
import { Product } from '../../types'
import { toast } from 'react-toastify'

export default function ProductListPage() {
  const dispatch = useAppDispatch()
  const { products, loading, pagination, filters } = useAppSelector((state) => state.products)
  const { token } = useAppSelector((state) => state.auth)
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const params = {
      page,
      size: 12,
      search: filters.search,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy,
      sortDir,
    }
    dispatch(fetchProducts(params))
  }, [dispatch, page, filters, sortBy, sortDir])

  const handleSearch = () => {
    setPage(0)
    dispatch(setFilters({ search: searchInput || undefined }))
    const sp = new URLSearchParams()
    if (searchInput) sp.set('search', searchInput)
    setSearchParams(sp)
  }

  const handlePriceFilter = () => {
    setPage(0)
    dispatch(setFilters({
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    }))
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">All Products</h1>

      {/* Filters */}
      <div className="card p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="flex gap-2 md:col-span-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search products..."
              className="input-field flex-1"
            />
            <button onClick={handleSearch} className="btn-primary px-4">
              Search
            </button>
          </div>

          {/* Price range */}
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min $"
              className="input-field"
              min="0"
            />
            <span className="text-gray-500">–</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max $"
              className="input-field"
              min="0"
            />
            <button onClick={handlePriceFilter} className="btn-secondary px-3 whitespace-nowrap">
              Apply
            </button>
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(0) }}
              className="input-field"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="averageRating">Rating</option>
            </select>
            <select
              value={sortDir}
              onChange={(e) => { setSortDir(e.target.value as 'asc' | 'desc'); setPage(0) }}
              className="input-field"
            >
              <option value="asc">↑ Asc</option>
              <option value="desc">↓ Desc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {pagination.totalElements} product{pagination.totalElements !== 1 ? 's' : ''} found
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 dark:text-gray-400">No products found.</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  )
}
