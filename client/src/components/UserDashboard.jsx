import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, LogOut, Minus, Plus, Trash2, X, CreditCard, ChevronRight } from 'lucide-react';

function UserDashboard() {
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [upi, setUpi] = useState('');
  const [amountToPay, setAmountToPay] = useState(0);

  // ✅ Centralize API base
  const API_BASE = window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://farmer.selfmade.lol";

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) setEmail(storedEmail);
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products/getAllproducts.php`);
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      setIsCartOpen(true); // Open cart if already added
    } else {
      setCart([...cart, { ...product, quantityInCart: 1 }]);
      setIsCartOpen(true); // Open cart on new add
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map((item) => {
      if (item._id === id) {
        const newQty = item.quantityInCart + change;
        return newQty > 0 ? { ...item, quantityInCart: newQty } : item;
      }
      return item;
    }));
  };

  const handleBuy = async () => {
    if (cart.length === 0) return alert('Your cart is empty!');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);
    const firstUpi = cart[0]?.upi; // Simplify: Pay to first farmer for demo

    if (!firstUpi) return alert('UPI not found for product');

    setAmountToPay(total);
    setUpi(firstUpi);

    try {
      const res = await fetch(`${API_BASE}/api/generate_qr.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upi: firstUpi, amount: total }),
      });

      if (!res.ok) throw new Error("Failed to generate QR");
      const blob = await res.blob();
      setQrImage(URL.createObjectURL(blob));

    } catch (err) {
      console.error('QR generation failed:', err);
      alert('QR generation failed');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <ShoppingCart size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            FreshMarket
          </span>
        </div>

        <div className="hidden md:flex relative max-w-md w-full mx-4">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for vegetables, fruits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center space-x-4 ml-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500 font-medium">Welcome,</p>
            <p className="text-sm font-bold text-gray-800">{email.split('@')[0]}</p>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
              >
                {cart.length}
              </motion.span>
            )}
          </button>

          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      {/* Hero / Filter Section */}
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Shop Fresh Produce</h2>
          <p className="text-gray-500">Directly from local farmers to your table.</p>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProducts.map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                key={p._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="h-56 overflow-hidden relative bg-gray-200">
                  {p.image ? (
                    <img src={`${API_BASE}/uploads/${p.image}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <button
                    onClick={() => addToCart(p)}
                    className="absolute bottom-4 right-4 bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{p.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">by {p.farmerName}</p>
                    </div>
                    <span className="font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg text-sm">
                      ₹{p.price}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold flex items-center">
                  <ShoppingCart size={20} className="mr-2 text-indigo-600" /> Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-4 text-gray-400">
                      <ShoppingCart size={40} />
                    </div>
                    <p className="text-gray-500 font-medium">Your cart is empty.</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-4 text-indigo-600 font-bold hover:underline">Start Shopping</button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div layout key={item._id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image && <img src={`${API_BASE}/uploads/${item.image}`} className="w-full h-full object-cover" alt="" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                        <p className="text-xs text-gray-500">₹{item.price} x {item.quantityInCart}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item._id, -1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"><Minus size={14} /></button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantityInCart}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{cart.reduce((sum, item) => sum + item.price * item.quantityInCart, 0)}
                  </span>
                </div>
                <button
                  onClick={handleBuy}
                  disabled={cart.length === 0}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 disabled:bg-gray-300 disabled:shadow-none transition-all flex justify-center items-center"
                >
                  Checkout Now <ChevronRight size={20} className="ml-2" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment QR Modal */}
      <AnimatePresence>
        {qrImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
              <button onClick={() => setQrImage(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>

              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} />
              </div>

              <h3 className="text-2xl font-bold mb-1">Payment Required</h3>
              <p className="text-gray-500 mb-6">Scan UP QR to pay <span className="font-bold text-black">₹{amountToPay}</span></p>

              <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 inline-block mb-4">
                <img src={qrImage} alt="Payment QR" className="w-48 h-48 mix-blend-multiply" />
              </div>

              <p className="text-xs text-gray-400 bg-gray-50 py-2 rounded-lg truncate px-4">UPI: {upi}</p>

              <button onClick={() => setQrImage(null)} className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors">
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default UserDashboard;
