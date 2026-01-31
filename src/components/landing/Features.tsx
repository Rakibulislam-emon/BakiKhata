"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  BarChart3,
  History,
  Smartphone,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "সম্পূর্ণ নিরাপদ (Secure)",
    description:
      "আপনার প্রতিটি লেনদেন এনক্রিপ্ট করা। ডাটা হারানোর কোনো ভয় নেই।",
    icon: ShieldCheck,
    className: "md:col-span-2",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  {
    title: "সুপার ফাস্ট",
    description: "বিদ্যুৎ গতিতে কাজ করে, এমনকি স্লো ইন্টারনেটেও।",
    icon: Zap,
    className: "md:col-span-1",
    gradient: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-500",
  },
  {
    title: "অফলাইন মোড",
    description: "ইন্টারনেট ছাড়াও কাজ করা যাবে খুব শীঘ্রই।",
    icon: Cloud,
    className: "md:col-span-1",
    gradient: "from-sky-500/10 to-sky-500/5",
    iconColor: "text-sky-500",
  },
  {
    title: "স্মার্ট রিপোর্ট",
    description: "দিন শেষে এক ক্লিকেই দেখুন লাভ-ক্ষতির পূর্ণাঙ্গ হিসাব।",
    icon: BarChart3,
    className: "md:col-span-2",
    gradient: "from-primary-500/10 to-primary-500/5",
    iconColor: "text-primary-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-secondary-900 mb-6"
          >
            কেন বেছে নেবেন <span className="text-primary-600">বাকি খাতা?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-secondary-500 max-w-2xl mx-auto"
          >
            আধুনিক জীবনের জন্য আধুনিক সব ফিচার। আপনার দৈনন্দিন হিসাব সহজ করতে
            আমরা আছি আপনার পাশে।
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative p-8 rounded-3xl border border-secondary-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden",
                feature.className,
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  feature.gradient,
                )}
              />

              <div className="relative z-10">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-secondary-50 group-hover:bg-white shadow-sm transition-colors",
                    feature.iconColor,
                  )}
                >
                  <feature.icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-secondary-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
