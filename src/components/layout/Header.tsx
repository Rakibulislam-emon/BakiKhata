"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";

export function Header() {
  const { session } = useAuth();

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white/40 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
      <div>
        <h2 className="text-xl font-bold text-secondary-800">স্বাগতম 👋</h2>
        <p className="text-sm text-secondary-500">{session?.user.email}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 bg-white/50 hover:bg-white rounded-full text-secondary-500 hover:text-primary-600 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
          {session?.user.email?.[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
