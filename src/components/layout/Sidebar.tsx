"use client";

import { Home, Settings, LogOut, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "ড্যাশবোর্ড", href: "/dashboard" },
  { icon: TrendingUp, label: "পাওনা তালিকা", href: "/dashboard/receivables" },
  { icon: TrendingDown, label: "দেনা তালিকা", href: "/dashboard/payables" },
  { icon: Settings, label: "সেটিংস", href: "/dashboard/settings" },
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
        <p className="text-xs md:pl-2 text-secondary-500 font-medium mt-1">
          ডিজিটাল সমাধান
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          let activeClass =
            "bg-primary-500 text-white shadow-lg shadow-primary-500/30";
          let inactiveClass =
            "text-secondary-600 hover:bg-white/50 hover:text-primary-600";
          let iconActive = "text-white";
          let iconInactive = "text-secondary-400 group-hover:text-primary-500";

          if (item.href === "/dashboard/receivables") {
            activeClass =
              "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30";
            inactiveClass =
              "text-secondary-600 hover:bg-emerald-50 hover:text-emerald-600";
            iconInactive = "text-emerald-500 group-hover:text-emerald-600";
          } else if (item.href === "/dashboard/payables") {
            activeClass = "bg-red-500 text-white shadow-lg shadow-red-500/30";
            inactiveClass =
              "text-secondary-600 hover:bg-red-50 hover:text-red-600";
            iconInactive = "text-red-500 group-hover:text-red-600";
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive ? activeClass : inactiveClass}
              `}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? iconActive : iconInactive}`}
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
