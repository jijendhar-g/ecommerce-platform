import { useEffect, useState, FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchProducts } from '../../store/slices/productSlice'
import { productService } from '../../services/productService'
import { Product, Category } from '../../types'
import api from '../../services/api'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { toast } from 'react-toastify'

interface ProductFormData {
  name: string
  description: string
  price: string
  stockQuantity: string
  categoryId: string
  imageUrl: string
}

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  categoryId: '',
  imageUrl: '',
}

export default function AdminProductsPage() {
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector((state) => state.products)
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductFormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts({ size: 100 }))
    api.get<Category[]>('/categories').then((r) => setCategories(r.data)).catch(() => {})
  }, [dispatch])

  const openCreate = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      categoryId: product.category.id.toString(),
      imageUrl: product.imageUrl ?? '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.stockQuantity) {
      toast.error('Please fill required fields')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity),
        imageUrl: form.imageUrl || undefined,
        category: { id: parseInt(form.categoryId) },
      }
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload)
        toast.success('Product updated')
      } else {
        await productService.createProduct(payload)
        toast.success('Product created')
      }
      setShowModal(false)
      dispatch(fetchProducts({ size: 100 }))
    } catch {
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return
    try {
      await productService.deleteProduct(id)
      toast.success('Product deleted')
      dispatch(fetchProducts({ size: 100 }))
    } catch {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <button onClick={openCreate} className="btn-primary px-5">+ Add Product</button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Rating</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{product.category.name}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.stockQuantity > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{product.averageRating.toFixed(1)} ⭐</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(product)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium mr-3 text-xs">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 font-medium text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No products found</div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Product name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Product description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock *</label>
                    <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} className="input-field" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-field" placeholder="https://..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
                    {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-3">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
