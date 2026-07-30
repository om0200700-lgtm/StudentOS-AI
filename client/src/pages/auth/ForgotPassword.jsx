import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6">
            <HiOutlineArrowLeft className="w-4 h-4" /> Back to login
          </Link>
          {!sent ? (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Forgot Password?</h2>
              <p className="text-slate-500 mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <motion.button whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-md disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </motion.button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Check your email</h2>
              <p className="text-slate-500 text-sm">We've sent a password reset link to <strong className="text-slate-700">{email}</strong></p>
              <Link to="/login" className="inline-block mt-6 text-sm text-blue-600 font-medium hover:text-blue-700">Back to Login</Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
