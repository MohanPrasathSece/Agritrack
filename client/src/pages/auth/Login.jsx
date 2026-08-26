import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Incorrect email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }} className="min-h-screen flex bg-slate-50">

      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/70 to-emerald-900/80" />

        <div className="relative z-10 flex flex-col justify-between h-full p-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-xl shadow-emerald-500/20">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
            </div>
            <span className="text-white font-black text-lg tracking-tighter uppercase">Agritrack</span>
          </Link>

          {/* Main copy */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-snug">
              Connecting farmers<br />to better markets.
            </h2>
            <p className="text-emerald-100/70 text-base leading-relaxed max-w-xs">
              Track your crops, verify quality, and get fair prices — all in one place.
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-white">12,000+</p>
                <p className="text-emerald-200/60 text-xs mt-1">Registered farmers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">₹2.4Cr+</p>
                <p className="text-emerald-200/60 text-xs mt-1">Transactions secured</p>
              </div>
            </div>
          </div>

          <p className="text-emerald-200/40 text-[9px] font-black uppercase tracking-[0.2em]">© 2026 Agritrack. All rights reserved.</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
            </div>
            <span className="text-slate-900 font-black tracking-tighter uppercase">Agritrack</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your account to continue.</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 mb-5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-slate-400 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Google sign in */}
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 py-3 px-5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-700 text-sm font-medium shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
