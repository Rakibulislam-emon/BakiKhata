"use client";

import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { session } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white/60 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
              ব
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 hidden sm:block">
              বাকি খাতা
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#features"
                className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                বৈশিষ্ট্য
              </a>
              <a
                href="#how-it-works"
                className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                কিভাবে কাজ করে
              </a>
              <Link
                href="/login"
                className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                লগইন
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            {session ? (
              <Link
                href="/dashboard"
                className="btn-primary py-2.5 px-6 text-sm"
              >
                ড্যাশবোর্ড
              </Link>
            ) : (
              <Link href="/login" className="btn-primary py-2.5 px-6 text-sm">
                একাউন্ট খুলুন
              </Link>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white/50 inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-b border-secondary-100 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="text-secondary-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                বৈশিষ্ট্য
              </a>
              <a
                href="#how-it-works"
                className="text-secondary-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                কিভাবে কাজ করে
              </a>
              <Link
                href="/login"
                className="w-full text-left bg-primary-50 text-primary-600 block px-3 py-2 rounded-md text-base font-medium mt-4"
              >
                লগ ইন / সাইন আপ
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
