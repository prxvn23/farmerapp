import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Plus, LogOut, Search, Bell, Menu, X,
  ChevronLeft, ChevronRight, Edit2, Trash2, IndianRupee, Image as ImageIcon,
  TrendingUp, Users, ShoppingBag
} from 'lucide-react';

const FarmerDashboard = () => {
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | products

  const [editProductId, setEditProductId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', quantity: '', farmerName: '', contact: '', upi: '', image: null,
  });

  const farmerId = localStorage.getItem('userId');

  const API_BASE = window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://farmer.selfmade.lol";

  // Pagination
  const PRODUCTS_PER_PAGE = 6; // Increased for grid view
  const [page, setPage] = useState(0);

  // Filtered Products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginate = (newDirection) => {
    setPage((prev) =>
      newDirection === 1
        ? Math.min(prev + 1, Math.floor(filteredProducts.length / PRODUCTS_PER_PAGE))
        : Math.max(prev - 1, 0)
    );
  };

  const pagedProducts = filteredProducts.slice(
    page * PRODUCTS_PER_PAGE,
    (page + 1) * PRODUCTS_PER_PAGE
  );

  // Stats
  const totalStock = products.reduce((acc, p) => acc + Number(p.quantity || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (Number(p.price || 0) * Number(p.quantity || 0)), 0);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products/getProductsByFarmer.php?farmerId=${farmerId}`);
      const productsList = res.data.data || res.data;
      if (Array.isArray(productsList)) {
        setProducts(productsList);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) setEmail(storedEmail);
    fetchProducts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) => {
        if (key === 'image' && value) formData.append(key, value);
        else if (key !== 'image') formData.append(key, value);
      });
      formData.append('farmerId', farmerId);

      const res = await axios.post(`${API_BASE}/api/products/addProduct.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setNewProduct({ name: '', price: '', quantity: '', farmerName: '', contact: '', upi: '', image: null });
        fetchProducts();
        alert("✅ Product Added!");
        setIsModalOpen(false); // Close Modal
      } else {
        alert("❌ Error: " + res.data.message);
      }
    } catch (err) {
      console.error("❌ Add error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/api/products/deleteProduct.php/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('❌ Delete error:', err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_BASE}/api/products/updateProduct.php/${id}`, { price: newPrice });
      setEditProductId(null);
      setNewPrice('');
      fetchProducts();
    } catch (err) {
      console.error("❌ Update error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-['Inter']">

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        className={`fixed md:relative z-30 w-64 bg-slate-900 text-white h-screen flex flex-col shadow-xl transition-all duration-300 ${!isSidebarOpen && 'hidden md:flex md:w-0 md:overflow-hidden'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            AgriAdmin
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-green-600/20 text-green-400' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-green-600/20 text-green-400' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Package size={20} className="mr-3" /> Products
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-4">
            <p className="text-xs text-slate-500 uppercase font-bold">Logged in as</p>
            <p className="text-sm font-medium truncate text-slate-300">{email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut size={18} className="mr-3" /> Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm z-20">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-64"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
              {email[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">

          {/* Stats Row */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mr-4"><Package size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <h3 className="text-2xl font-bold text-gray-800">{products.length}</h3>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl mr-4"><TrendingUp size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500">Total Stock Value</p>
                  <h3 className="text-2xl font-bold text-gray-800">₹{totalValue.toLocaleString()}</h3>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl mr-4"><Users size={24} /></div>
                <div>
                  <p className="text-sm text-gray-500">Active Customers</p>
                  <h3 className="text-2xl font-bold text-gray-800">--</h3>
                </div>
              </motion.div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">My Listings</h3>
            {/* Mobile Search - Visible only on small screens */}
            <div className="md:hidden relative mr-2">
              <Search className="absolute left-2 top-2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-sm w-32"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center shadow-lg shadow-green-600/20 transition-all hover:scale-105"
            >
              <Plus size={18} className="mr-2" /> Add Product
            </button>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500">Try adding a new product or changing your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {pagedProducts.map((p) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={p._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="h-48 overflow-hidden relative bg-gray-100">
                      {p.image ? (
                        <img src={`${API_BASE}/uploads/${p.image}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon size={40} />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                        Qty: {p.quantity}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-gray-800 truncate pr-2">{p.name}</h4>
                        {editProductId === p._id ? (
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              className="w-16 border rounded px-1 py-0.5 text-sm mr-1"
                            />
                            <button onClick={() => handleUpdate(p._id)} className="text-green-600 hover:text-green-700 bg-green-50 p-1 rounded"><CheckCircle size={16} /></button>
                          </div>
                        ) : (
                          <span className="flex items-center text-green-700 font-bold bg-green-50 px-2 py-1 rounded-lg text-sm">
                            ₹{p.price}
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 space-y-1 mb-4">
                        <p className="flex items-center"><Users size={14} className="mr-2" /> {p.farmerName}</p>
                        <p className="truncate text-xs bg-gray-50 p-1.5 rounded border border-gray-100 mt-2 font-mono text-gray-600 select-all">
                          UPI: {p.upi}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-50">
                        {editProductId !== p._id && (
                          <button
                            onClick={() => { setEditProductId(p._id); setNewPrice(p.price); }}
                            className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="mr-2" /> Edit Price
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="mr-2" /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > PRODUCTS_PER_PAGE && (
            <div className="flex justify-center mt-8 gap-4">
              <button onClick={() => paginate(-1)} disabled={page === 0} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button onClick={() => paginate(1)} disabled={(page + 1) * PRODUCTS_PER_PAGE >= filteredProducts.length} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-gray-800">Add New Product</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Product Name</label>
                    <input type="text" placeholder="e.g. Fresh Apples" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Price (₹)</label>
                    <input type="number" placeholder="0.00" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Quantity (kg)</label>
                    <input type="number" placeholder="0" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Unit</label>
                    <div className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm">Kilograms (kg)</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Farmer Info</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" value={newProduct.farmerName} onChange={(e) => setNewProduct({ ...newProduct, farmerName: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" required />
                    <input type="text" placeholder="Phone Number" value={newProduct.contact} onChange={(e) => setNewProduct({ ...newProduct, contact: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Payment Info</label>
                  <input type="text" placeholder="UPI ID (e.g. name@okhdfc)" value={newProduct.upi} onChange={(e) => setNewProduct({ ...newProduct, upi: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" required />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Product Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {newProduct.image ? (
                        <p className="text-sm text-green-600 font-medium">Selected: {newProduct.image.name}</p>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="text-xs text-gray-500">Click to upload image</p>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })} />
                  </label>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors">
                  Submit Listing
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FarmerDashboard;
