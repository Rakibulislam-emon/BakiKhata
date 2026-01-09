import React from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Check, TrendingDown, Clock, Trash2, X } from "lucide-react";
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
          className="btn-outline border-secondary-200 text-xs py-2 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          title="সব মুছুন"
        >
          <X className="w-3 h-3 mr-1" />
          সব মুছুন
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
              className={`glass-card p-4 flex items-center justify-between group ${
                transaction.isPaid ? "opacity-75 bg-secondary-50/50" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    transaction.isPaid
                      ? "bg-green-100/50 text-green-600"
                      : "bg-red-100/50 text-red-600"
                  }`}
                >
                  {transaction.isPaid ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-secondary-900 text-lg">
                    {transaction.customerName}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1 font-medium">
                    {formatDateTime(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <p
                  className={`text-lg font-mono font-bold ${
                    transaction.isPaid
                      ? "text-green-600 line-through decoration-2"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Custom toast/modal would be better than window.confirm in a full implementation
                    // keeping confirm for simplicity but styling the button better
                    if (confirm("আপনি কি নিশ্চিত যে এই বিল মুছে ফেলতে চান?")) {
                      onDeleteTransaction(transaction.id);
                    }
                  }}
                  className="p-2 text-secondary-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
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
