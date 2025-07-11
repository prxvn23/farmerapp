import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:8000/api/login.php', {
      email,
      password,
    });

    if (response.data.success) {
  alert("✅ Login successful");
  localStorage.setItem("userId", response.data.userId);
  localStorage.setItem("role", response.data.role);
  localStorage.setItem("email", response.data.email); // ✅ add this line
  navigate("/dashboard");



    } else {
      alert("❌ Login failed: " + response.data.message);
    }
  } catch (err) {
    console.error("❌ Backend Error:", err.response?.data || err.message);
    alert("❌ Login failed. Check console.");
  }
};




  return (
    
<div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
  <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
    </form>
    <p className="mt-4 text-sm text-center">
      Don't have an account? <Link to="/register" className="text-blue-600 underline">Register</Link>
    </p>
  </div>
</div>
  );
}

export default Login;
