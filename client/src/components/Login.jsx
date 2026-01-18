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
  const API_BASE = window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://farmer.selfmade.lol";

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
        { email, password, csrf_token: csrfToken }, // ✅ Send in Body as backup
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const userData = response.data.user; // ✅ Extract nested user object

        // ✅ Save user info correctly
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("role", userData.role);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("email", userData.email);

        // ✅ Navigate directly based on role
        if (userData.role === "farmer") {
          navigate("/farmer");
        } else if (userData.role === "user") {
          navigate("/user");
        } else {
          alert(`Unknown role: ${userData.role}! Contact admin.`);
        }


      } else {
        console.log("❌ Login Failed Response:", response.data);
        alert("❌ Login Failed (Server Response): " + JSON.stringify(response.data));
      }
    } catch (err) {
      console.error("❌ Backend Error:", err.response?.data || err.message);
      // Show cleaner error, or raw details if message missing
      const msg = err.response?.data?.message
        ? "❌ " + err.response.data.message
        : "❌ Login Failed: " + JSON.stringify(err.response?.data || err.message);

      alert(msg);
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
