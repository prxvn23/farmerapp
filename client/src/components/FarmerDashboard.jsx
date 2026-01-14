import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const FarmerDashboard = () => {
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', quantity: '', farmerName: '', contact: '', upi: '', image: null,
  });

  const farmerId = localStorage.getItem('userId');

  // ✅ Centralize API base
  const API_BASE = "http://localhost:5000";

  // Pagination
  const PRODUCTS_PER_PAGE = 3;
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setPage((prev) =>
      newDirection === 1
        ? Math.min(prev + 1, Math.floor(products.length / PRODUCTS_PER_PAGE))
        : Math.max(prev - 1, 0)
    );
  };

  const pagedProducts = products.slice(
    page * PRODUCTS_PER_PAGE,
    (page + 1) * PRODUCTS_PER_PAGE
  );

  // ✅ Fetch farmer products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products/getProductsByFarmer.php?farmerId=${farmerId}`);
      setProducts(res.data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) setEmail(storedEmail);

    fetchProducts();
  }, []);

  // ✅ Add new product
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) => {
        if (key === 'image' && value) formData.append(key, value);
        else if (key !== 'image') formData.append(key, value);
      });
      formData.append('farmerId', farmerId);

      await axios.post(`${API_BASE}/api/products/addProduct.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNewProduct({ name: '', price: '', quantity: '', farmerName: '', contact: '', upi: '', image: null });
      fetchProducts();
    } catch (err) {
      console.error("❌ Add error:", err);
    }
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/products/deleteProduct.php/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('❌ Delete error:', err);
    }
  };

  // ✅ Edit product
  const handleEdit = (product) => {
    setEditProductId(product._id);
    setNewPrice(product.price);
  };

  // ✅ Update product
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

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Animations
  const swipeVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="flex justify-between mb-6">
        <div>👤 Logged in as: <strong>{email}</strong></div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleLogout} className="bg-red-600 text-white px-4 py-1 rounded">
          Logout
        </motion.button>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-6">👨‍🌾 Farmer Dashboard</h2>

      {/* Add Product Form */}
      <motion.form
        onSubmit={handleAdd}
        encType="multipart/form-data"
        className="space-y-4 mt-6 p-6 bg-gray-100 rounded-xl shadow"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <h3 className="text-xl font-bold mb-2">➕ Add New Product</h3>

        <input type="text" placeholder="Product Name" value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full p-3 text-lg border rounded" required />

        <input type="number" placeholder="Price" value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="w-full p-3 text-lg border rounded" required />

        <input type="number" placeholder="Quantity" value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          className="w-full p-3 text-lg border rounded" required />

        <input type="text" placeholder="Farmer Name" value={newProduct.farmerName}
          onChange={(e) => setNewProduct({ ...newProduct, farmerName: e.target.value })}
          className="w-full p-3 text-lg border rounded" required />

        <input type="text" placeholder="Contact Number" value={newProduct.contact}
          onChange={(e) => setNewProduct({ ...newProduct, contact: e.target.value })}
          className="w-full p-3 text-lg border rounded" required />

        <input type="text" placeholder="Farmer UPI ID" value={newProduct.upi}
          onChange={(e) => setNewProduct({ ...newProduct, upi: e.target.value })}
          className="w-full p-3 text-lg border rounded" required />

        <input type="file" accept="image/*"
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
          className="w-full p-3 text-lg border rounded" />

        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          type="submit" className="w-full bg-blue-600 text-white py-3 text-lg rounded hover:bg-blue-700">
          ➕ Add Product
        </motion.button>
      </motion.form>

      {/* Swipe Product List */}
      <div className="relative mt-10">
        <AnimatePresence custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -100) paginate(1);
              if (offset.x > 100) paginate(-1);
            }}
            className="space-y-4"
          >
            {pagedProducts.map((p) => (
              <motion.div key={p._id} className="border p-5 rounded-xl shadow-sm bg-white">
                <h4 className="font-bold text-lg mb-1">{p.name}</h4>
                <p>
                  ₹{' '}
                  {editProductId === p._id ? (
                    <>
                      <input type="number" value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="border px-2 w-24 mr-2 rounded" />
                      <button onClick={() => handleUpdate(p._id)} className="bg-green-600 text-white px-2 py-1 rounded mr-2">Update</button>
                      <button onClick={() => setEditProductId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                    </>
                  ) : (
                    <>
                      {p.price}
                      <button onClick={() => handleEdit(p)} className="ml-3 text-blue-600 underline">Edit</button>
                    </>
                  )}
                </p>
                <p>Qty: {p.quantity} kg</p>
                <p>Farmer: {p.farmerName} | Contact: {p.contact}</p>
                <p>UPI ID: {p.upi}</p>
                {p.image && (
                  <img src={`${API_BASE}/uploads/${p.image}`} alt={p.name} className="w-24 mt-2 rounded" />
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(p._id)}
                  className="mt-3 bg-red-500 text-white px-4 py-1 rounded">
                  Delete
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Arrows */}
        <div className="flex justify-between mt-6">
          <button onClick={() => paginate(-1)} disabled={page === 0} className="text-2xl text-blue-600">⬅️</button>
          <button onClick={() => paginate(1)} disabled={(page + 1) * PRODUCTS_PER_PAGE >= products.length} className="text-2xl text-blue-600">➡️</button>
        </div>
      </div>
    </motion.div>
  );
};

export default FarmerDashboard;
