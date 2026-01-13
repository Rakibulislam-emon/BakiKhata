"use client";

import { Home, Settings, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-secondary-200 pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className={`absolute top-0 w-12 h-1 rounded-b-full ${item.color}`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <div
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? "translate-y-1" : ""
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? item.color + "/10" : "transparent"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? item.textColor : "text-secondary-400"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? item.textColor : "text-secondary-400"
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
