"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Users, CheckCircle2 } from "lucide-react";

interface SummaryCardsProps {
  totalBaki: number;
  totalPaid: number;
  transactionCount: number;
  customerCount: number;
}

export const SummaryCards = ({
  totalBaki,
  totalPaid,
  transactionCount,
  customerCount,
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Baki - Main Card */}
      <div className="md:col-span-3 lg:col-span-1 glass-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary-500/20" />
        <div className="relative z-10">
          <div className="text-secondary-500 font-medium mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            মোট বাকি (মার্কেট পাওনা)
          </div>
          <div className="flex items-baseline gap-1">
            <h3 className="text-4xl lg:text-5xl font-bold text-secondary-900 font-mono tracking-tighter">
              {formatCurrency(Math.abs(totalBaki))}
            </h3>
          </div>
          <p className="text-xs text-secondary-400 mt-2">
            সর্বমোট {customerCount} জন গ্রাহকের কাছে
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="md:col-span-3 lg:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Collected */}
        <div className="glass-card p-5 hover:bg-emerald-50/50 transition-colors border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
              আদালকৃত
            </span>
          </div>
          <p className="text-secondary-500 text-sm font-medium">মোট আদায়</p>
          <p className="text-2xl font-bold text-secondary-900 mt-1 font-mono">
            {formatCurrency(totalPaid)}
          </p>
        </div>

        {/* Total Customers */}
        <div className="glass-card p-5 hover:bg-blue-50/50 transition-colors border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-secondary-500 text-sm font-medium">মোট গ্রাহক</p>
          <p className="text-2xl font-bold text-secondary-900 mt-1 font-mono">
            {customerCount}
          </p>
        </div>

        {/* Total Transactions */}
        <div className="glass-card p-5 hover:bg-purple-50/50 transition-colors border-l-4 border-l-purple-500 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-secondary-500 text-sm font-medium">
            লেনদেন সংখ্যা
          </p>
          <p className="text-2xl font-bold text-secondary-900 mt-1 font-mono">
            {transactionCount}
          </p>
        </div>
      </div>
    </div>
  );
};
