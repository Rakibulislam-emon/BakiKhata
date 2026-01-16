import React from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Clock,
  Trash2,
  X,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onClearRecent: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const RecentTransactions = ({
  transactions,
  onClearRecent,
  onDeleteTransaction,
}: RecentTransactionsProps) => {
  const router = useRouter();

  if (transactions.length === 0) return null;

  return (
    <div className="w-full px-4 mt-6 pb-32">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
          সাম্প্রতিক লেনদেন
        </h3>
        <button
          onClick={onClearRecent}
          className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
          title="সব মুছুন"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {transactions.map((transaction, index) => {
            const isReceivable = transaction.amount >= 0;
            const isPaid = transaction.isPaid;

            // Dynamic Styles based on status
            const themeColor = isPaid
              ? "bg-slate-500"
              : isReceivable
              ? "bg-emerald-500"
              : "bg-red-500";

            const textColor = isPaid
              ? "text-slate-500"
              : isReceivable
              ? "text-emerald-600"
              : "text-red-600";

            const Icon = isReceivable ? TrendingUp : TrendingDown;

            return (
              <motion.div
                layout
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  const route = isReceivable ? "receivables" : "payables";
                  router.push(
                    `/dashboard/${route}/${encodeURIComponent(
                      transaction.customerName
                    )}`
                  );
                }}
                className="group relative bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-md transition-all border border-slate-200/60 cursor-pointer overflow-hidden"
              >
                {/* Curved Side Indicator Bar */}
                <div
                  className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full ${themeColor}`}
                />

                <div className="flex items-center justify-between pl-3">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Modern Squircle Avatar */}
                    <div
                      className={`w-14 h-14 rounded-2xl ${themeColor} flex items-center justify-center text-white text-xl font-bold border border-white shadow-sm shrink-0`}
                    >
                      {transaction.customerName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors truncate">
                        {transaction.customerName}
                      </h4>
                      {/* Refined Date Pill */}
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                          {formatDateTime(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-2 shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold font-mono tracking-tighter tabular-nums ${textColor}`}
                      >
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      <div
                        className={`flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-90 ${textColor}`}
                      >
                        {isPaid ? (
                          <>পরিশোধিত</>
                        ) : (
                          <>
                            <Icon className="w-3 h-3" />
                            {isReceivable ? "পাওনা" : "দেনা"}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Navigation Arrow */}
                    <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
