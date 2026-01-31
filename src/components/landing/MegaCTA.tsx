"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function MegaCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary-900 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-primary-600/20 via-purple-900/40 to-secondary-900/80 animate-spin-slow origin-center blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight"
        >
          হিসাব রাখার ধরন বদলানোর <br />
          <span className="text-primary-400">সময় এখনই</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-secondary-300 mb-12 max-w-2xl mx-auto"
        >
          হাজারো মানুষ বাকি খাতা ব্যবহার করে তাদের হিসাব রাখার দুশ্চিন্তা
          কমিয়েছেন। আপনি কেন পিছিয়ে থাকবেন?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-secondary-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-primary-50 hover:scale-105 transition-all shadow-xl shadow-primary-900/20"
          >
            ফ্রি একাউন্ট খুলুন
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-secondary-400 font-medium">
            ১ মিনিটেই সেটআপ • সম্পূর্ণ ফ্রি
          </p>
        </motion.div>
      </div>
    </section>
  );
}
