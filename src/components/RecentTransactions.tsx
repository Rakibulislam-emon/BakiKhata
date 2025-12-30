import React from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Check, TrendingDown, Clock, Trash2 } from "lucide-react";

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
    <div className="max-w-4xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          🕐 সাম্প্রতিক লেনদেন
        </h3>
        <button
          onClick={onClearRecent}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center gap-2 text-sm font-medium"
          title="সব মুছুন"
        >
          <Trash2 className="w-4 h-4" />
          সব মুছুন
        </button>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`bg-white rounded-xl p-4 shadow-card ${
              transaction.isPaid ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    transaction.isPaid ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {transaction.isPaid ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {transaction.customerName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDateTime(transaction.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p
                  className={`font-bold ${
                    transaction.isPaid
                      ? "text-green-600 line-through"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("আপনি কি নিশ্চিত যে এই বিল মুছে ফেলতে চান?")) {
                      onDeleteTransaction(transaction.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
