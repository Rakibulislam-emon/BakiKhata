"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Bell,
  ChevronRight,
  LogOut,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactionsContext } from "@/context/TransactionsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { session, logout } = useAuth();
  const pathname = usePathname();
  const { openAddModal } = useTransactionsContext();
  const [scrolled, setScrolled] = useState(false);
  const [greeting, setGreeting] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Time-aware greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) setGreeting("শুভ রাত্রি");
    else if (hour < 12) setGreeting("সুপ্রভাত");
    else if (hour < 17) setGreeting("শুভ দুপুর");
    else if (hour < 21) setGreeting("শুভ বিকেল");
    else setGreeting("শুভ সন্ধ্যা");
  }, []);

  // Generate breadcrumbs from pathname
  const getBreadcrumbs = () => {
    if (pathname === "/dashboard") return "ওভারভিউ";
    const parts = pathname.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1];

    switch (lastPart) {
      case "receivables":
        return "পাওনা তালিকা";
      case "payables":
        return "দেনা তালিকা";
      case "settings":
        return "সেটিংস";
      default:
        return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }
  };

  const userInitial = session?.user.email?.[0].toUpperCase() || "U";
  const bgClass = scrolled
    ? "bg-white/80 backdrop-blur-xl border-white/40 shadow-sm"
    : "bg-transparent border-transparent";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-all duration-300 border-b",
        bgClass,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={pathname}
            className="flex items-center gap-2 text-xs text-secondary-500 font-medium mb-0.5"
          >
            <span>ড্যাশবোর্ড</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary-600">{getBreadcrumbs()}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg md:text-xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-600 bg-clip-text text-transparent flex items-center gap-2"
          >
            {greeting}
            <span className="text-secondary-400 font-normal hidden sm:inline">
              , {session?.user.email?.split("@")[0]}
            </span>
          </motion.h1>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Desktop Quick Add */}
        <div className="hidden md:block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full font-medium shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন লেনদেন</span>
          </motion.button>
        </div>

        {/* Notifications */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-secondary-100/50 text-secondary-500 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          </motion.button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 ring-2 ring-white hover:ring-primary-100 transition-all">
                {userInitial}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 glass-card">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-secondary-900">
                  {session?.user.email?.split("@")[0]}
                </p>
                <p className="text-xs leading-none text-secondary-500 truncate">
                  {session?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-secondary-100" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg focus:bg-secondary-50 text-secondary-600"
            >
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>সেটিংস</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-secondary-100" />
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer rounded-lg focus:bg-red-50 text-red-600 focus:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>লগআউট</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
