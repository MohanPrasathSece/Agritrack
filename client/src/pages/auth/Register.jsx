import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Please enter your full name.');
    if (!formData.email.trim()) return setError('Please enter your email address.');
    if (!formData.phone.trim()) return setError('Please enter your phone number.');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters long.');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    setError('');

    const { confirmPassword, ...registerData } = formData;
    registerData.role = null;
    localStorage.setItem('agritrack_onboarding', 'true');

    const result = await register(registerData);
    if (result.success) {
      navigate('/select-role');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all";

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }} className="min-h-screen flex bg-white">

      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=2000")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/70 to-emerald-900/80" />

        <div className="relative z-10 flex flex-col justify-between h-full p-14">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-xl shadow-emerald-500/20">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
            </div>
            <span className="text-white font-black text-lg tracking-tighter uppercase">Agritrack</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-snug">
              Join thousands of<br />
              <span className="text-emerald-300">farmers & traders.</span>
            </h2>
            <p className="text-emerald-100/70 text-base leading-relaxed max-w-xs">
              List your crops, get AI quality grading, and connect directly with buyers — all for free.
            </p>

            <div className="space-y-4 pt-4">
              {[
                'Free to register, no hidden charges',
                'Get fair market price for your crops',
                'AI-powered quality verification',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-300" />
                  </div>
                  <p className="text-emerald-100/80 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-emerald-200/40 text-[9px] font-black uppercase tracking-[0.2em]">© 2026 Agritrack. All rights reserved.</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-10"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-500/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150" />
            </div>
            <span className="text-slate-900 font-black tracking-tighter uppercase">Agritrack</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Create your account</h1>
            <p className="text-slate-500 text-sm">It's free and only takes a minute.</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="name" type="text" required value={formData.name} onChange={handleChange}
                    placeholder="Your full name" className={inputClass} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="email" type="email" required value={formData.email} onChange={handleChange}
                    placeholder="you@example.com" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Phone number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className={inputClass} />
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="password" type={showPassword ? 'text' : 'password'} required
                    value={formData.password} onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`${inputClass} pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="confirmPassword" type="password" required
                    value={formData.confirmPassword} onChange={handleChange}
                    placeholder="Re-enter password" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input type="checkbox" required id="terms" className="mt-0.5 w-4 h-4 accent-emerald-600 cursor-pointer" />
              <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                I agree to Agritrack's{' '}
                <Link to="/terms" className="text-emerald-600 hover:underline font-medium">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-emerald-600 hover:underline font-medium">Privacy Policy</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google sign up */}
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 py-3 px-5 border border-slate-200 rounded-xl hover:bg-white transition-all text-slate-700 text-sm font-medium bg-white shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="" />
            Sign up with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
