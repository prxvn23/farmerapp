import React, { useEffect, useState } from 'react';
import axios from 'axios';

const handleLogout = () => {
  localStorage.clear();
  window.location.href = '/';
};

function UserDashboard() {
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [upi, setUpi] = useState('');
  const [amountToPay, setAmountToPay] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/products/getAllproducts.php');
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      alert('Product already in cart');
    } else {
      setCart([...cart, { ...product, quantityInCart: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantityInCart: item.quantityInCart + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id && item.quantityInCart > 1
          ? { ...item, quantityInCart: item.quantityInCart - 1 }
          : item
      )
    );
  };

  const handleBuy = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);
    const firstUpi = cart[0]?.upi;

    if (!firstUpi) {
      alert('UPI not found for product');
      return;
    }

    setAmountToPay(total);
    setUpi(firstUpi);

    try {
      const res = await fetch('http://pravinraj023-project.onrender.com/generate_qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upi: firstUpi, amount: total }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setQrImage(url);

    } catch (err) {
      console.error('QR generation failed:', err);
      alert('QR generation failed');
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedByFarmer = filteredProducts.reduce((acc, product) => {
    const key = product.farmerId;
    if (!acc[key]) {
      acc[key] = {
        farmerName: product.farmerName,
        contact: product.contact,
        products: [],
      };
    }
    acc[key].products.push(product);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>👤 <span className="font-semibold">Logged in as:</span> {email}</div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">User Dashboard 🛒</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      />

      <h3 className="text-xl font-semibold mb-3">Available Products</h3>
      {Object.entries(groupedByFarmer).map(([farmerId, group]) => (
        <div key={farmerId} className="mb-6">
          <h4 className="text-lg font-semibold">👨‍🌾 {group.farmerName} - 📞 {group.contact}</h4>
          <div className="grid md:grid-cols-2 gap-6 mt-2">
            {group.products.map((p) => (
              <div key={p._id} className="border rounded-lg shadow p-4">
                <img
                  src={`http://pravinraj023-project.onrender.com/uploads/${p.image}`}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h4 className="text-lg font-bold mt-2">{p.name}</h4>
                <p>Price: ₹{p.price}</p>
                <p>Qty: {p.quantity}</p>
                <button
                  onClick={() => addToCart(p)}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <hr className="my-6" />
      <h3 className="text-xl font-semibold">Your Cart ({cart.length} items)</h3>
      {cart.length === 0 ? (
        <p className="text-gray-500">No items in cart</p>
      ) : (
        <ul className="space-y-3 mt-3">
          {cart.map((item) => (
            <li key={item._id} className="flex items-center justify-between bg-gray-100 p-3 rounded">
              <div>
                {item.name} - ₹{item.price} × {item.quantityInCart} = ₹
                {item.price * item.quantityInCart}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => increaseQuantity(item._id)}
                  className="bg-green-500 px-2 rounded text-white hover:bg-green-600"
                >
                  +
                </button>
                <button
                  onClick={() => decreaseQuantity(item._id)}
                  disabled={item.quantityInCart === 1}
                  className="bg-yellow-500 px-2 rounded text-white hover:bg-yellow-600 disabled:opacity-50"
                >
                  -
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 px-2 rounded text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <>
          <button
            onClick={handleBuy}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Buy Now
          </button>

          {qrImage && (
            <div className="mt-6 text-center bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Scan & Pay ₹{amountToPay}
              </h3>
              <img
                src={qrImage}
                alt="UPI QR"
                className="mx-auto w-48 h-48 border rounded"
              />
              <p className="text-sm mt-2 text-gray-600">Pay to: {upi}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserDashboard;
