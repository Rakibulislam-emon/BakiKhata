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
                initial={{ opacity: 0, y: 20 }}
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
                className="group relative bg-white rounded-[2rem] p-5 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all border border-slate-50 cursor-pointer overflow-hidden"
              >
                {/* Curved Bar Indicator */}
                <div
                  className={`absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full ${themeColor}`}
                />

                <div className="flex items-center justify-between pl-3">
                  <div className="flex items-center gap-4">
                    {/* Avatar with Initials */}
                    <div
                      className={`w-14 h-14 rounded-full ${themeColor} flex items-center justify-center text-white text-xl font-bold shadow-md`}
                    >
                      {transaction.customerName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-800 leading-tight">
                        {transaction.customerName}
                      </h4>
                      {/* Date Pill */}
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 rounded-full">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] font-medium text-slate-500">
                          {formatDateTime(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`text-xl font-bold ${textColor} tracking-tight font-mono`}
                      >
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      <div
                        className={`flex items-center justify-end gap-1 text-[11px] font-bold ${textColor} uppercase tracking-wider mt-0.5`}
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

                    {/* Navigation Arrow / Delete Action */}
                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                    </div>
                  </div>
                </div>

                {/* Hover Delete Button Overlay (Optional, distinct interaction) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTransaction(transaction.id);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-0 active:opacity-100 transition-opacity md:group-hover:opacity-100 md:translate-x-full md:group-hover:translate-x-0"
                  style={{ display: "none" }} // Removing hover delete for cleaner mobile UI, can rely on detail page or specific gesture if needed. Keeping simpler clean look.
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
