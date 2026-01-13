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
  { icon: TrendingUp, label: "পাওনা তালিকা", href: "/customers" },
  { icon: TrendingDown, label: "দেনা তালিকা", href: "/payables" },
  { icon: Settings, label: "সেটিংস", href: "/settings" },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
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
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-white/90 backdrop-blur-xl z-50 shadow-2xl md:hidden border-r border-white/20"
          >
            <div className="flex items-center justify-between p-6">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  বাকি খাতা
                </h1>
                <p className="text-xs text-secondary-500 font-medium mt-1">
                  মোবাইল মেনু
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary-100 rounded-full text-secondary-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
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

            <div className="absolute bottom-0 left-0 w-full p-6 border-t border-secondary-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-secondary-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all duration-300 group bg-secondary-50"
              >
                <LogOut className="w-5 h-5 text-secondary-400 group-hover:text-red-500" />
                <span className="font-medium">লগআউট</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
