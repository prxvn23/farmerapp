import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔗 Centralized API base (Relative path for Prod/Proxy)
  const API_BASE = "";

  // 🔑 Fetch CSRF token when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`${API_BASE}/utils/csrf.php`, {
          credentials: "include",
        });

        const text = await res.text();
        try {
          const data = JSON.parse(text);
          console.log("✅ CSRF Token (Login):", data.csrf_token);
          setCsrfToken(data.csrf_token);
        } catch (parseErr) {
          console.error("❌ Invalid JSON from server:", text);
          setError("Server returned invalid CSRF response.");
        }
      } catch (err) {
        console.error("❌ CSRF fetch error:", err);
        setError("Failed to fetch CSRF token.");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!csrfToken) {
      alert("❌ CSRF token not loaded. Please refresh and try again.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/api/login.php`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // ✅ Save user info correctly
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);

        // ✅ Navigate directly based on role
        if (response.data.role === "farmer") {
          navigate("/farmer");
        } else if (response.data.role === "user") {
          navigate("/user");
        } else {
          alert("Unknown role! Contact admin.");
        }


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

        {loading ? (
          <p className="text-center text-gray-500">Loading CSRF token...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
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

            {/* Debug hidden field */}
            <input type="hidden" value={csrfToken} readOnly />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              disabled={!csrfToken}
            >
              {csrfToken ? "Login" : "Loading..."}
            </button>
          </form>
        )}

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
