"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { DashboardPreview } from "./DashboardPreview";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 1]); // Keeping it fully opaque
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1]); // Removing scale shrink

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] flex flex-col items-center py-32 lg:pt-48 overflow-hidden bg-white"
    >
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-200/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 shadow-sm backdrop-blur-md mb-8 hover:bg-white/80 transition-colors cursor-default"
        >
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-semibold bg-gradient-to-r from-secondary-900 to-secondary-600 bg-clip-text text-transparent">
            নতুন প্রজন্মের জন্য তৈরি
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-secondary-900 mb-8 leading-[1.1]"
        >
          ব্যক্তিগত বা ব্যবসায়িক <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 animate-gradient bg-300%">
            সব হিসাব এক সাথেই
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-xl text-secondary-500 mb-10 leading-relaxed"
        >
          বন্ধু-বান্ধব, মেস মেম্বার কিংবা ব্যবসার কাস্টমার - সবার সাথে লেনদেনের
          হিসাব রাখুন এখন এক অ্যাপেই। খাতা-কলমের ঝামেলা এড়িয়ে হোন স্মার্ট।
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link
            href="/login"
            className="group relative px-8 py-4 bg-secondary-900 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-primary-500/25 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              শুরু করুন ফ্রিতে
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <button
            onClick={() => {
              const element = document.getElementById("features");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 bg-white/50 text-secondary-700 rounded-full font-semibold text-lg border border-white/60 shadow-lg hover:shadow-xl hover:bg-white hover:scale-105 transition-all duration-300"
          >
            ফিচার দেখুন
          </button>
        </motion.div>

        {/* Dashboard Preview Container with 3D Title Effect and Parallax */}
        <motion.div
          style={{ y, opacity, scale }}
          className="relative w-full max-w-6xl mx-auto"
        >
          <div className="absolute inset-x-0 -top-20 h-[500px] bg-gradient-to-b from-primary-200/10 to-transparent blur-3xl -z-10" />

          <div className="relative rounded-[2rem] border border-slate-200/60 bg-white p-2 md:p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* The Actual Dashboard Preview */}
            <div className="rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-white relative z-10">
              <DashboardPreview />
            </div>

            {/* Reflections/Glows */}
            <div className="absolute -inset-1 rounded-[2.1rem] bg-gradient-to-br from-primary-500/10 to-purple-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
