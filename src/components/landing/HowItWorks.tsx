"use client";

import { motion } from "framer-motion";
import { UserPlus, Wallet, BarChart3 } from "lucide-react";

const steps = [
  {
    num: "০১",
    title: "অ্যাকাউন্ট খুলুন",
    description:
      "মাত্র ১ মিনিটে আপনার মোবাইল নম্বর দিয়ে ফ্রি অ্যাকাউন্ট খুলুন। কোনো ক্রেডিট কার্ডের প্রয়োজন নেই।",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    num: "০২",
    title: "লেনদেন যোগ করুন",
    description:
      "কাস্টমারের নাম ও টাকার পরিমাণ লিখুন। অটোমেটিক মেসেজ চলে যাবে কাস্টমারের কাছে।",
    icon: Wallet,
    color: "bg-emerald-500",
  },
  {
    num: "০৩",
    title: "রিপোর্ট দেখুন",
    description:
      "ড্যাশবোর্ডে দেখুন আপনার মোট পাওনা ও দেনা। ব্যবসার অবস্থা বুঝুন সহজেই।",
    icon: BarChart3,
    color: "bg-purple-500",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-secondary-50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-secondary-900 mb-6"
          >
            কিভাবে কাজ করে?
          </motion.h2>
          <p className="text-lg text-secondary-600">
            মাত্র ৩টি সহজ ধাপে শুরু করুন
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-secondary-200 via-primary-200 to-secondary-200" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative flex flex-col items-center text-center group"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 ${step.color}`}
              >
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                {step.title}
              </h3>
              <p className="text-secondary-600 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
