import { useState } from 'react';
import { Product, Variant } from '../types';
import {
  Plus, Search, Edit3, Trash2, Package, Tag, X, Save, AlertCircle
} from 'lucide-react';

interface Props {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export function Products({ products, onUpdateProducts }: Props) {
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.keyword.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const emptyProduct: Product = {
    id: `p${Date.now()}`,
    name: '',
    description: '',
    price: 0,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    keyword: '',
    category: '',
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    variants: [{ id: `v${Date.now()}`, name: '', stock: 0, sku: '' }],
  };

  const openNew = () => {
    setEditingProduct({ ...emptyProduct, id: `p${Date.now()}` });
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct({ ...product, variants: product.variants.map(v => ({ ...v })) });
    setShowForm(true);
  };

  const deleteProduct = (id: string) => {
    onUpdateProducts(products.filter(p => p.id !== id));
  };

  const saveProduct = () => {
    if (!editingProduct) return;
    const exists = products.find(p => p.id === editingProduct.id);
    if (exists) {
      onUpdateProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    } else {
      onUpdateProducts([...products, editingProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const addVariant = () => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      variants: [...editingProduct.variants, { id: `v${Date.now()}`, name: '', stock: 0, sku: '' }],
    });
  };

  const removeVariant = (idx: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      variants: editingProduct.variants.filter((_, i) => i !== idx),
    });
  };

  const updateVariant = (idx: number, field: keyof Variant, value: string | number) => {
    if (!editingProduct) return;
    const variants = [...editingProduct.variants];
    variants[idx] = { ...variants[idx], [field]: value };
    setEditingProduct({ ...editingProduct, variants });
  };

  const totalStock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products · {products.reduce((s, p) => s + totalStock(p), 0)} total units</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transition-all hover:scale-105">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Search products or keywords..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
            <div className="relative overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-indigo-600 shadow-sm">
                  <Tag className="w-3 h-3 inline mr-1" />{product.keyword}
                </span>
              </div>
              {product.compareAtPrice && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">
                    SALE
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2 justify-end">
                  <button onClick={() => openEdit(product)} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                    <Edit3 className="w-4 h-4 text-gray-700" />
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 font-medium uppercase">{product.category}</p>
              <h3 className="font-semibold text-gray-900 mt-1 truncate">{product.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-gray-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Package className="w-3.5 h-3.5" />
                  <span>{totalStock(product)} in stock</span>
                </div>
                <span className="text-xs text-gray-400">{product.variants.length} variants</span>
              </div>
              {totalStock(product) < 5 && totalStock(product) > 0 && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
                  <AlertCircle className="w-3.5 h-3.5" /> Low stock warning
                </div>
              )}
              {totalStock(product) === 0 && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5" /> Out of stock
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      {showForm && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {products.find(p => p.id === editingProduct.id) ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Vintage Floral Dress" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment Keyword</label>
                  <input type="text" value={editingProduct.keyword} onChange={e => setEditingProduct({ ...editingProduct, keyword: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" placeholder="e.g., DRESS" />
                  <p className="text-xs text-gray-400 mt-1">Viewers comment this to purchase</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} placeholder="Describe the product..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price</label>
                  <input type="number" step="0.01" value={editingProduct.compareAtPrice || ''} onChange={e => setEditingProduct({ ...editingProduct, compareAtPrice: parseFloat(e.target.value) || undefined })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Dresses" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" value={editingProduct.image} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Variants (Sizes/Colors)</label>
                  <button onClick={addVariant} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Variant
                  </button>
                </div>
                <div className="space-y-2">
                  {editingProduct.variants.map((variant, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="text" value={variant.name} onChange={e => updateVariant(idx, 'name', e.target.value)} placeholder="e.g., Small"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input type="number" value={variant.stock} onChange={e => updateVariant(idx, 'stock', parseInt(e.target.value) || 0)} placeholder="Stock"
                        className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input type="text" value={variant.sku} onChange={e => updateVariant(idx, 'sku', e.target.value)} placeholder="SKU"
                        className="w-28 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" />
                      {editingProduct.variants.length > 1 && (
                        <button onClick={() => removeVariant(idx)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
                Cancel
              </button>
              <button onClick={saveProduct} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
                <Save className="w-4 h-4" /> Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
