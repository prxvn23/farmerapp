import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  // ✅ Detect environment
  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://farmer.selfmade.lol";

  // ✅ Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await axios.get(`${API_BASE}/utils/csrf.php`, {
          withCredentials: true,
        });
        setCsrfToken(res.data.csrf_token);
        console.log("✅ CSRF Token Fetched:", res.data.csrf_token);
      } catch (err) {
        console.error("❌ Failed to fetch CSRF token:", err.message);
      }
    };
    fetchCsrfToken();
  }, [API_BASE]);

  // ✅ Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE}/api/register.php`,
        {
          name,
          email,
          password,
          role,
          csrf_token: csrfToken,
        },
        { withCredentials: true }
      );
      alert("✅ Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("❌ Backend Response:", err.response?.data || err.message);
      alert(
        err.response?.data?.message || "❌ Registration failed. Check console."
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="farmer">Farmer</option>
          </select>

          <input type="hidden" value={csrfToken} readOnly />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            disabled={!csrfToken}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
