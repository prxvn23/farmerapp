import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Tractor, ArrowRight, ArrowLeft, CheckCircle, Mail, Lock, UserCircle } from "lucide-react";

function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // 'user' or 'farmer'
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(false);
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
      } catch (err) {
        console.error("❌ Failed to fetch CSRF token:", err.message);
      }
    };
    fetchCsrfToken();
  }, [API_BASE]);

  // ✅ Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!role) return alert("Please select a role first.");

    setLoading(true);
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
      // Success Animation could go here, but for now just alert/redirect
      alert("✅ Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("❌ Backend Response:", err.response?.data || err.message);
      alert(
        err.response?.data?.message || "❌ Registration failed. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStep = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side: Dynamic Illustration Based on Role */}
        <div className={`md:w-5/12 p-12 text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-500
          ${role === 'farmer' ? 'bg-gradient-to-br from-green-600 to-emerald-800' : 'bg-gradient-to-br from-blue-600 to-indigo-800'}
        `}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-bfqf3e09873fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] opacity-10 bg-cover bg-center"></div>

          <div className="relative z-10 mt-10">
            <h2 className="text-4xl font-bold mb-4">
              {step === 1 ? "Join Us." : role === 'farmer' ? "Grow with Us." : "Shop Fresh."}
            </h2>
            <p className="text-lg opacity-90">
              {step === 1
                ? "Choose how you want to use the platform."
                : role === 'farmer'
                  ? "Reach customers directly and sell your fresh produce."
                  : "Support local farmers and get fresh produce delivered."}
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex space-x-2 mb-2">
              <div className={`h-2 w-8 rounded-full ${step === 1 ? 'bg-white' : 'bg-white/30'}`}></div>
              <div className={`h-2 w-8 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/30'}`}></div>
            </div>
            <p className="text-sm opacity-75">Step {step} of 2</p>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="md:w-7/12 p-8 md:p-12 relative flex flex-col justify-center">

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800">I want to...</h3>
                </div>

                <div className="grid gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, borderColor: '#3b82f6' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => nextStep('user')}
                    className="flex items-center p-6 border-2 border-gray-100 rounded-xl hover:bg-blue-50 transition-all group text-left"
                  >
                    <div className="bg-blue-100 p-4 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Buy Products</h4>
                      <p className="text-sm text-gray-500">I want to buy fresh produce.</p>
                    </div>
                    <ArrowRight className="ml-auto text-gray-300 group-hover:text-blue-500" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, borderColor: '#10b981' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => nextStep('farmer')}
                    className="flex items-center p-6 border-2 border-gray-100 rounded-xl hover:bg-green-50 transition-all group text-left"
                  >
                    <div className="bg-green-100 p-4 rounded-full mr-4 group-hover:bg-green-200 transition-colors">
                      <Tractor className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Sell Produce</h4>
                      <p className="text-sm text-gray-500">I am a farmer looking to sell.</p>
                    </div>
                    <ArrowRight className="ml-auto text-gray-300 group-hover:text-green-500" />
                  </motion.button>
                </div>

                <div className="text-center mt-8">
                  <span className="text-gray-500">Already have an account? </span>
                  <Link to="/" className="text-blue-600 font-medium hover:underline">Login</Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setStep(1)}
                  className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Role Selection
                </button>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h3>
                <p className="text-gray-500 mb-8">
                  Signing up as a <span className={`font-bold uppercase ${role === 'farmer' ? 'text-green-600' : 'text-blue-600'}`}>{role}</span>
                </p>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="input-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none" />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none" />
                    </div>
                  </div>

                  <input type="hidden" value={csrfToken} readOnly />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className={`w-full py-3.5 px-4 rounded-xl text-white font-medium text-lg shadow-lg transition-all mt-4
                      ${role === 'farmer' ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-500/30' : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30'}
                    `}
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Complete Registration"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

export default Register;
