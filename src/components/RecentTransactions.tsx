import React from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  CheckCircle2,
  TrendingDown,
  Clock,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  if (transactions.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-12 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-500" />
          সাম্প্রতিক লেনদেন
        </h3>
        <button
          onClick={onClearRecent}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-100 text-secondary-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all text-xs font-semibold border border-transparent hover:border-red-200"
          title="সব মুছুন"
        >
          <X className="w-3.5 h-3.5" />
          তালিকা মুছুন
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {transactions.map((transaction, index) => (
            <motion.div
              layout
              key={transaction.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05 }}
              className={`glass-card p-4 flex items-center justify-between group border-l-4 ${
                transaction.isPaid
                  ? "border-l-primary-500 bg-primary-50/30"
                  : transaction.amount > 0
                  ? "border-l-emerald-500"
                  : "border-l-red-500"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full shadow-sm ${
                    transaction.isPaid
                      ? "bg-primary-100 text-primary-600"
                      : transaction.amount > 0
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.isPaid ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : transaction.amount > 0 ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-secondary-900 text-base">
                    {transaction.customerName}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p
                    className={`text-lg font-mono font-bold tracking-tight ${
                      transaction.isPaid
                        ? "text-primary-600 line-through decoration-2 opacity-70"
                        : transaction.amount > 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  {!transaction.isPaid && (
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        transaction.amount > 0
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.amount > 0 ? "পাওনা" : "দেনা"}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTransaction(transaction.id);
                  }}
                  className="p-2 text-secondary-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                  title="মুছুন"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
