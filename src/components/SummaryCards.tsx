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
    <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
      <div className="bg-primary-500 rounded-3xl p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 text-center mb-8">
          <p className="text-primary-100 text-sm font-medium mb-1">
           মোট বাকি
          </p>
          <div className="flex flex-col items-center">
            <p className="text-5xl font-bold font-mono tracking-tight mb-2 text-white">
              {formatCurrency(Math.abs(totalBaki))}
            </p>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                totalBaki > 0
                  ? "bg-white/20 text-white"
                  : totalBaki < 0
                  ? "bg-red-500/20 text-red-100"
                  : "bg-white/20 text-white"
              }`}
            >
              
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
            <p className="text-primary-100 text-xs mb-1">মোট লেনদেন</p>
            <p className="text-xl font-bold">{transactionCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
            <p className="text-primary-100 text-xs mb-1">মোট গ্রাহক</p>
            <p className="text-xl font-bold">{customerCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
            <p className="text-primary-100 text-xs mb-1">পরিশোধিত</p>
            <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
