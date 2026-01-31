"use client";

import { Home, Settings, TrendingDown, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTransactionsContext } from "@/context/TransactionsContext";

export function BottomNav() {
  const pathname = usePathname();
  const { openAddModal } = useTransactionsContext();

  const navItems = [
    {
      icon: Home,
      label: "হোম",
      href: "/dashboard",
      color: "bg-primary-500",
      textColor: "text-primary-500",
    },
    {
      icon: TrendingUp,
      label: "পাওনা",
      href: "/dashboard/receivables",
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
    },
    {
      type: "fab", // Marker for FAB
      href: "#",
      label: "",
      icon: Plus,
    },
    {
      icon: TrendingDown,
      label: "দেনা",
      href: "/dashboard/payables",
      color: "bg-red-500",
      textColor: "text-red-500",
    },
    {
      icon: Settings,
      label: "সেটিংস",
      href: "/dashboard/settings",
      color: "bg-primary-500",
      textColor: "text-primary-500",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-t border-white/20 dark:border-white/5 pb-safe ring-1 ring-black/5 dark:ring-white/5">
      <nav className="flex justify-around items-center h-16 relative">
        {navItems.map((item, index) => {
          if (item.type === "fab") {
            return (
              <div key="add-button" className="relative -top-6">
                <motion.div
                  className="absolute inset-0 bg-primary-500/30 rounded-full blur-xl scale-110"
                  animate={{
                    scale: [1.1, 1.25, 1.1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={openAddModal}
                  className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-[0_8px_25px_-5px_rgba(16,185,129,0.5)] flex items-center justify-center ring-4 ring-white dark:ring-slate-900"
                >
                  <Plus className="w-8 h-8" />
                </motion.button>
              </div>
            );
          }

          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full group"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className={`absolute top-0 w-10 h-1 rounded-b-full ${item.color}`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}

              <div
                className={`flex flex-col items-center gap-1 transition-all duration-500 ${
                  isActive ? "-translate-y-0.5" : ""
                }`}
              >
                <motion.div
                  animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                  className={`p-1.5 rounded-xl transition-all duration-300 ${
                    isActive ? item.color + "/10" : "transparent"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-300 ${
                      isActive
                        ? item.textColor
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                </motion.div>
                <span
                  className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${
                    isActive
                      ? item.textColor
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
