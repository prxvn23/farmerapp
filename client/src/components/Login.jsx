import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row"
      >

        {/* Left Side - Artistic */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595009901132-7b8f95c5240e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] opacity-20 bg-cover bg-center"></div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <h1 className="text-4xl font-bold mb-2">Farmer Market</h1>
            <p className="text-blue-100">Connecting growers directly to consumers.</p>
          </motion.div>

          <div className="relative z-10 hidden md:block">
            <p className="text-sm text-blue-200">© 2024 Selfmade Ninja Academy</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-500">Securing connection...</span>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">

              {/* Email Input */}
              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Extras: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Debug hidden field */}
              <input type="hidden" value={csrfToken} readOnly />

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start"
                  >
                    <span className="mr-2">⚠️</span> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full py-3.5 px-4 rounded-xl text-white font-medium text-lg shadow-lg shadow-blue-500/30 transition-all
                  ${!csrfToken ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/50'}`}
                disabled={!csrfToken}
              >
                {csrfToken ? "Sign In" : "Initializing..."}
              </motion.button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
