// client/src/login.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  // 🔗 Centralized API base (using HTTPS to avoid mixed-content errors)
 const API_BASE = "https://pravinraj023-project.onrender.com";

useEffect(() => {
  fetch(`${API_BASE}backend/api/csrf-token.php`, { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      console.log("CSRF Token:", data.token);
      setCsrfToken(data.token);
    })
    .catch(err => console.error("❌ CSRF fetch error:", err));
}, []);


  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE}/login.php`,
        { email, password, csrf_token: csrfToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("✅ Login successful");
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("email", response.data.email);
        navigate("/dashboard");
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (err) {
      console.error("❌ Backend Error:", err.response?.data || err.message);
      alert("❌ Login failed. Check console.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
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
          {/* Hidden CSRF field for debugging */}
          <input type="hidden" value={csrfToken} readOnly />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            disabled={!csrfToken} // ⛔ prevent login before token loads
          >
            {csrfToken ? "Login" : "Loading..."}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
