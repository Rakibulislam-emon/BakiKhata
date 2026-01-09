import React from "react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 text-secondary-900 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] relative overflow-hidden border border-white/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10 text-center mb-10">
          <p className="text-secondary-600 text-sm font-semibold tracking-wide uppercase mb-2">
            মোট বাকি
          </p>
          <div className="flex flex-col items-center">
            <p className="text-6xl font-bold font-mono tracking-tighter text-secondary-900 mb-2 drop-shadow-sm">
              {formatCurrency(Math.abs(totalBaki))}
            </p>
            <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="group bg-white/50 hover:bg-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 text-center border border-white/60 shadow-sm backdrop-blur-sm">
            <p className="text-secondary-500 text-[10px] font-bold uppercase tracking-wider mb-1 group-hover:text-primary-600 transition-colors">
              মোট লেনদেন
            </p>
            <p className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors">
              {transactionCount}
            </p>
          </div>
          <div className="group bg-white/50 hover:bg-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 text-center border border-white/60 shadow-sm backdrop-blur-sm">
            <p className="text-secondary-500 text-[10px] font-bold uppercase tracking-wider mb-1 group-hover:text-primary-600 transition-colors">
              মোট গ্রাহক
            </p>
            <p className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors">
              {customerCount}
            </p>
          </div>
          <div className="group bg-white/50 hover:bg-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 text-center border border-white/60 shadow-sm backdrop-blur-sm">
            <p className="text-secondary-500 text-[10px] font-bold uppercase tracking-wider mb-1 group-hover:text-primary-600 transition-colors">
              পরিশোধিত
            </p>
            <p className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
