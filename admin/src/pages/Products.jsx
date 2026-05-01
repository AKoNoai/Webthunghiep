import { useEffect, useState } from 'react';
import { productService } from '@/services/api';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    image: '',
    stock: '',
    sku: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAllProducts({ limit: 100 });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productService.updateProduct(editingId, formData);
      } else {
        await productService.createProduct(formData);
      }
      loadProducts();
      setShowForm(false);
      setFormData({ name: '', description: '', price: '', discountPrice: '', category: '', image: '', stock: '', sku: '' });
      setEditingId(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await productService.deleteProduct(id);
        loadProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-slate-900">Products</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', discountPrice: '', category: '', image: '', stock: '', sku: '' });
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-900/20"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">{editingId ? 'Edit' : 'Add'} Product</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="col-span-2 px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
            />
            <input
              type="number"
              placeholder="Discount Price"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
            />
            <input
              type="text"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
              className="px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600/30 focus:border-cyan-700"
            />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-900/20">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-cyan-50/60">
                <td className="px-6 py-4 text-sm text-slate-700">{product.name}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{product.category}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">${product.price}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{product.stock}</td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-cyan-700 hover:text-cyan-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
