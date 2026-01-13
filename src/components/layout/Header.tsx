"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { session, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    toast("আপনি কি নিশ্চিত যে লগআউট করতে চান?", {
      action: {
        label: "লগআউট",
        onClick: () => logout(),
      },
    });
  };

  return (
    <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-white/40 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-secondary-500 hover:bg-white/50 rounded-xl"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <Link href="/dashboard" className="text-lg md:text-xl font-bold text-secondary-800">
            স্বাগতম 👋
          </Link>
          <p className="text-xs md:text-sm text-secondary-500 hidden sm:block">
            {session?.user.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2.5 bg-white/50 hover:bg-white rounded-full text-secondary-500 hover:text-primary-600 transition-all relative shadow-sm hover:shadow-md">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform"
          >
            {session?.user.email?.[0].toUpperCase()}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white rounded-xl shadow-xl border border-secondary-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-secondary-100 md:hidden">
                <p className="text-xs text-secondary-500 truncate">
                  {session?.user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                লগআউট
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
