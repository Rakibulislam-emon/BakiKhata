"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Store,
  Truck,
  Utensils,
  Coffee,
  ShoppingCart,
  Anchor,
  Briefcase,
  GraduationCap,
  Users2,
  HeartHandshake,
  Home,
  HandCoins,
} from "lucide-react";

const users = [
  { icon: Store, name: "দোকানদার" },
  { icon: GraduationCap, name: "ছাত্র-ছাত্রী" },
  { icon: Users2, name: "মেস মেম্বার" },
  { icon: HeartHandshake, name: "বন্ধু-বান্ধব" },
  { icon: Briefcase, name: "ব্যবসায়ী" },
  { icon: Home, name: "গৃহিণী" },
  { icon: ShoppingBag, name: "উদ্যোক্তা" },
  { icon: HandCoins, name: "ঋণদাতা" },
];

export function SocialProof() {
  return (
    <section className="py-10 border-y border-secondary-100 bg-secondary-50/50 overflow-hidden">
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-secondary-500 uppercase tracking-widest">
          সবার জন্য, সব প্রয়োজনে
        </p>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="flex animate-marquee whitespace-nowrap gap-16 px-8">
          {[...users, ...users, ...users].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-secondary-400 font-medium text-lg grayscale hover:grayscale-0 hover:text-primary-600 transition-all cursor-default"
            >
              <item.icon className="w-6 h-6" />
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-secondary-50 to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-secondary-50 to-transparent z-10" />
      </div>
    </section>
  );
}
