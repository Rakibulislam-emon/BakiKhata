"use client";

import React from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Clock, X, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
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
    <div className="w-full">
      <h3 className="text-xl  text-center font-black text-slate-900 dark:text-white tracking-tight  gap-3">
        সাম্প্রতিক অ্যাক্টিভিটি
      </h3>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl  font-black text-slate-900 dark:text-white tracking-tight  gap-3">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
            সর্বশেষ ৫টি
          </span>
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearRecent}
          className="text-xs font-bold text- text-slate-400 hover:text-rose-500 transition-colors px-3 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10"
        >
          ক্লিয়ার করুন
        </motion.button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {transactions.map((transaction, index) => {
            const isReceivable = transaction.amount >= 0;
            const isPaid = transaction.isPaid;

            const textColor = isPaid
              ? "text-slate-500"
              : isReceivable
                ? "text-emerald-600"
                : "text-rose-600";

            const route = isReceivable ? "receivables" : "payables";

            return (
              <motion.div
                layout
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                onClick={() => {
                  router.push(
                    `/dashboard/${route}/${encodeURIComponent(
                      transaction.customerName,
                    )}`,
                  );
                }}
                className="group relative flex items-center justify-between p-4 rounded-[1.5rem] bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    color: isPaid
                      ? "#94a3b8"
                      : isReceivable
                        ? "#10b981"
                        : "#f43f5e",
                  }}
                />

                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black transition-transform group-hover:scale-110 duration-500 ${
                      isPaid
                        ? "bg-slate-100 text-slate-500"
                        : isReceivable
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                    }`}
                  >
                    {transaction.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {transaction.customerName}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {formatDateTime(transaction.date)}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[120px]">
                        {transaction.description || "কোনো বিবরণ নেই"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end relative z-10">
                  <div
                    className={`text-base font-black font-mono tracking-tighter ${textColor} flex items-center gap-1`}
                  >
                    {isReceivable ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div
                    className={`text-[9px] font-black uppercase tracking-[0.1em] mt-1 px-2 py-0.5 rounded-md ${
                      isPaid
                        ? "bg-slate-100 text-slate-500 dark:bg-slate-800"
                        : isReceivable
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
                    }`}
                  >
                    {isPaid ? "পরিশোধিত" : isReceivable ? "পাওনা" : "দেনা"}
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
