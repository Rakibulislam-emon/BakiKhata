"use client";

import {
  Home,
  Settings,
  LogOut,
  X,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: Home, label: "ড্যাশবোর্ড", href: "/dashboard" },
  { icon: TrendingUp, label: "পাওনা তালিকা", href: "/dashboard/receivables" },
  { icon: TrendingDown, label: "দেনা তালিকা", href: "/dashboard/payables" },
  { icon: Settings, label: "সেটিংস", href: "/dashboard/settings" },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
          />

          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-[280px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl z-50 shadow-[20px_0_50px_-10px_rgba(0,0,0,0.1)] md:hidden border-r border-white/20 dark:border-white/5"
          >
            <div className="flex items-center justify-between p-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-2xl font-bold bg-gradient-to-br from-primary-600 to-primary-800 bg-clip-text text-transparent tracking-tight">
                  বাকি খাতা
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
                  Premium Edition
                </p>
              </motion.div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 mt-4">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.href;

                let activeClass =
                  "bg-primary-500 text-white shadow-lg shadow-primary-500/30";
                let inactiveClass =
                  "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary-600";
                let iconActive = "text-white";
                let iconInactive =
                  "text-slate-400 group-hover:text-primary-500";

                if (item.href === "/dashboard/receivables") {
                  activeClass =
                    "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30";
                  inactiveClass =
                    "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-600";
                  iconInactive = "text-emerald-500 transition-colors";
                } else if (item.href === "/dashboard/payables") {
                  activeClass =
                    "bg-rose-500 text-white shadow-lg shadow-rose-500/30";
                  inactiveClass =
                    "text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600";
                  iconInactive = "text-rose-500 transition-colors";
                }

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                        ${isActive ? activeClass : inactiveClass}
                      `}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          isActive ? iconActive : iconInactive
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className="font-semibold text-sm">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-100 dark:border-white/5">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-500 rounded-2xl transition-all duration-300 group font-semibold text-sm"
              >
                <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
                <span>লগআউট</span>
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
