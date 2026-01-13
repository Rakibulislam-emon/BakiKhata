"use client";

import { Home, Users, Settings, LogOut, TrendingDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "ড্যাশবোর্ড", href: "/dashboard" },
  { icon: Users, label: "গ্রাহক তালিকা", href: "/customers" },
  { icon: TrendingDown, label: "দেনা তালিকা", href: "/payables" },
  { icon: Settings, label: "সেটিংস", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    toast("আপনি কি নিশ্চিত যে লগআউট করতে চান?", {
      action: {
        label: "লগআউট",
        onClick: () => logout(),
      },
    });
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/20 bg-white/40 backdrop-blur-xl z-50 shadow-2xl shadow-primary-500/5"
    >
      <div className="p-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          বাকি খাতা
        </h1>
        <p className="text-xs text-secondary-500 font-medium mt-1">
          ব্যবসায়ের ডিজিটাল সমাধান
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${
                  isActive
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                    : "text-secondary-600 hover:bg-white/50 hover:text-primary-600"
                }
              `}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-white"
                    : "text-secondary-400 group-hover:text-primary-500"
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-secondary-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 text-secondary-400 group-hover:text-red-500" />
          <span className="font-medium">লগআউট</span>
        </button>
      </div>
    </motion.aside>
  );
}
