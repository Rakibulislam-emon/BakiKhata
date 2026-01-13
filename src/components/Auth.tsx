import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Lock,
  Mail,
  Loader2,
  ArrowRight,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const getBengaliErrorMessage = (error: string) => {
  const err = error.toLowerCase();
  if (err.includes("invalid login credentials"))
    return "ইমেইল বা পাসওয়ার্ড সঠিক নয়";
  if (
    err.includes("user already registered") ||
    err.includes("already registered") ||
    err.includes("email already exists")
  )
    return "এই ইমেইল দিয়ে ইতিমধ্যে একটি একাউন্ট খোলা আছে";
  if (err.includes("password should be at least 6 characters"))
    return "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
  if (err.includes("rate limit") || err.includes("too many requests"))
    return "অতিরিক্ত চেষ্টার কারণে সাময়িকভাবে বন্ধ আছে। কিছুক্ষণ পর আবার চেষ্টা করুন";
  return "একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন";
};

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              typeof window !== "undefined" ? window.location.origin : "",
          },
        });
        if (error) throw error;
        setMessage(
          "রেজিস্ট্রেশন সফল হয়েছে! অনুগ্রহ করে আপনার ইমেইল চেক করুন।"
        );
      }
    } catch (err: any) {
      setError(getBengaliErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full glass-card p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-4 shadow-soft"
          >
            {isLogin ? (
              <LogIn className="w-8 h-8" />
            ) : (
              <UserPlus className="w-8 h-8" />
            )}
          </motion.div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            বাকি খাতা
          </h1>
          <p className="text-secondary-500">
            {isLogin
              ? "আপনার একাউন্টে লগ ইন করুন"
              : "বিনামূল্যে নতুন একাউন্ট খুলুন"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </motion.div>
            )}
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-primary-50 text-primary-700 rounded-xl text-sm border border-primary-100 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5 ml-1">
                ইমেইল
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5 ml-1">
                পাসওয়ার্ড
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? "লগ ইন" : "সাইন আপ"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setMessage("");
            }}
            disabled={loading}
            className="text-sm text-secondary-500 hover:text-primary-600 font-medium transition-colors disabled:opacity-50"
          >
            {isLogin
              ? "একাউন্ট নেই? নতুন একাউন্ট খুলুন"
              : "আগেই একাউন্ট আছে? লগ ইন করুন"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
