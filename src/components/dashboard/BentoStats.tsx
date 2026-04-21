"use client";

import { formatCurrency } from "@/lib/utils";
import { m } from "@/lib/framer";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

interface BentoStatsProps {
  totalBaki: number;
  totalDena: number;
  todayBaki: number;
  todayJoma: number;
  transactionCount: number;
  customerCount: number;
}

export function BentoStats({
  totalBaki,
  totalDena,
  todayBaki,
  todayJoma,
  transactionCount,
  customerCount,
}: BentoStatsProps) {
  // Net Balance (Global market position)
  const netBalance = totalBaki + totalDena;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 auto-rows-fr">
      {/* 1. Main Global Balance Card (2x2) */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="col-span-2 md:col-span-2 lg:col-span-2 row-span-2 relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] p-8 flex flex-col justify-between group"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-primary-500/20 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] -ml-20 -mb-20 group-hover:bg-indigo-500/20 transition-all duration-1000" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center ring-1 ring-white/10 backdrop-blur-sm">
              <Wallet className="w-5 h-5 text-primary-400" />
            </div>
            <span className="font-bold text-sm uppercase tracking-wider">
              নেট ব্যালেন্স
            </span>
          </div>
          <m.h2
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-5xl md:text-6xl font-black text-white font-mono tracking-tighter mt-4"
          >
            {formatCurrency(netBalance)}
          </m.h2>
          <p className="text-slate-500 mt-3 text-sm font-medium">
            বর্তমান ব্যবসার সামগ্রিক অবস্থা
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 mt-10">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/10 group/item transition-all hover:bg-white/10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              মোট পাওনা
            </p>
            <p className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">
              {formatCurrency(totalBaki)}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/10 group/item transition-all hover:bg-white/10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              মোট জমা
            </p>
            <p className="text-2xl font-bold text-indigo-400 font-mono tracking-tight">
              {formatCurrency(Math.abs(totalDena))}
            </p>
          </div>
        </div>
      </m.div>

      {/* 2. Today's Paona (Credit Given Today) */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="col-span-1 group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-8 -mt-8" />
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-500">
          <ArrowUpRight className="w-6 h-6" />
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
            আজকের পাওনা
          </p>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 font-mono tracking-tighter">
            {formatCurrency(todayBaki)}
          </p>
        </div>
      </m.div>

      {/* 3. Today's Joma (Collections Today) */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="col-span-1 group relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-8 -mt-8" />
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-500">
          <ArrowDownLeft className="w-6 h-6" />
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
            আজকের জমা
          </p>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 font-mono tracking-tighter">
            {formatCurrency(todayJoma)}
          </p>
        </div>
      </m.div>



      {/* 5. Combined Information Card (Transactions & Customers) */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="col-span-2 md:col-span-1 lg:col-span-4 group relative overflow-hidden bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 rounded-[2rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
      >
        <div className="absolute inset-0 bg-primary-500/5 dark:bg-primary-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex gap-12">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-primary-500" />
                মোট লেনদেন
              </p>
              <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">
                {transactionCount}
              </p>
            </div>
            <div className="border-l border-slate-200 dark:border-white/10 pl-12">
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <Users className="w-3 h-3 text-blue-500" />
                মোট কাস্টমার
              </p>
              <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">
                {customerCount}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex h-16 w-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl items-center justify-center ring-1 ring-slate-200 dark:ring-slate-700 transition-transform group-hover:scale-105 duration-500">
            <TrendingUp className="w-8 h-8 text-primary-500 opacity-80" />
          </div>
        </div>
      </m.div>
    </div>
  );
}
