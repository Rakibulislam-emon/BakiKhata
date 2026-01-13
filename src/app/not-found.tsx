"use client";

import Link from "next/link";
import { MoveLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f8faff] to-[#eef2ff] p-4">
      <div className="glass-card max-w-md w-full p-8 text-center border-t-4 border-t-primary-500">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="text-4xl font-bold text-primary-600">?</span>
        </div>

        <h1 className="text-6xl font-black text-secondary-900 mb-2 tracking-tighter">
          404
        </h1>
        <h2 className="text-xl font-bold text-secondary-800 mb-4">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h2>
        <p className="text-secondary-500 mb-8 max-w-xs mx-auto">
          দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা মুছে ফেলা হয়েছে বা তার নাম
          পরিবর্তন করা হয়েছে।
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            ড্যাশবোর্ডে ফিরে যান
          </Link>

          <Link
            href="javascript:history.back()" // Simple client-side back, Next.js generic link usually better but this works for simple "Back"
            className="w-full py-3 px-4 bg-white text-secondary-600 hover:bg-secondary-50 font-bold rounded-xl border border-secondary-200 transition-all flex items-center justify-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              if (typeof history !== "undefined") history.back();
            }}
          >
            <MoveLeft className="w-5 h-5" />
            পেছনে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
