import React from "react";
import { Transaction } from "@/types";
import { formatDate, formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Trash2,
  Plus,
  X,
  Square,
  CheckSquare,
  Clock,
  Wallet,
  Receipt,
  CheckCircle2,
  DollarSign,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerDetailProps {
  customer: {
    name: string;
    transactions: Transaction[];
  };
  totals: {
    totalBaki: number;
    totalPaid: number;
    unpaidCount: number;
    paidCount: number;
  } | null;
  onBack: () => void;
  onDeleteAll: () => void;
  onToggleAllPaid: () => void;
  onTogglePaid: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
  onDeleteAllPaid: () => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  formData: {
    name: string;
    amount: string;
    notes: string;
  };
  setFormData: (
    data: Partial<{ name: string; amount: string; notes: string }>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CustomerDetail = ({
  customer,
  totals,
  onBack,
  onDeleteAll,
  onToggleAllPaid,
  onTogglePaid,
  onDeleteTransaction,
  onDeleteAllPaid,
  showAddForm,
  setShowAddForm,
  formData,
  setFormData,
  onSubmit,
}: CustomerDetailProps) => {
  if (!customer || !totals) return null;

  const allUnpaid = customer.transactions.filter((t) => !t.isPaid);
  const allPaid = customer.transactions.filter((t) => t.isPaid);
  const canSelectAll = allUnpaid.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-secondary-100 py-4 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                {customer.name}
              </h1>
              <p className="text-secondary-500 text-sm flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                লেনদেনের হিসাব
              </p>
            </div>
          </div>
          <button
            onClick={onDeleteAll}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="সব মুছুন"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-xl shadow-primary-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="relative z-10 text-center mb-8">
            <p className="text-primary-100 text-sm font-medium mb-1">
              বর্তমান বাকি
            </p>
            <p className="text-5xl font-bold font-mono tracking-tight">
              {formatCurrency(totals.totalBaki)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
              <p className="text-primary-100 text-xs mb-1">মোট বিল</p>
              <p className="text-xl font-bold">
                {customer.transactions.length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
              <p className="text-primary-100 text-xs mb-1">বাকি আছে</p>
              <p className="text-xl font-bold">{totals.unpaidCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
              <p className="text-primary-100 text-xs mb-1">পরিশোধিত</p>
              <p className="text-xl font-bold">{totals.paidCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Bill Form */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4 text-secondary-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-500" />
            নতুন বিল যোগ করুন
          </h2>
          <form onSubmit={onSubmit} className="flex gap-3">
            <div className="flex-1 relative group">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="পরিমাণ"
                min="0"
                step="0.01"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-secondary-200 bg-secondary-50/50 
                focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 
                outline-none transition-all font-mono text-sm"
                required
              />
            </div>
            <div className="flex-[2] relative group">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="নোট (যেমন: চা নাস্তা)..."
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-secondary-200 bg-secondary-50/50 
                focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 
                outline-none transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95 flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>

      {/* Unpaid Bills Section */}
      {allUnpaid.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              বাকি বিল ({allUnpaid.length})
            </h3>
            <button
              onClick={onToggleAllPaid}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-all text-xs font-semibold border border-primary-200"
            >
              {canSelectAll ? (
                <CheckSquare className="w-3.5 h-3.5" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
              সব পরিশোধ করুন
            </button>
          </div>

          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {allUnpaid.map((transaction) => (
                <motion.div
                  layout
                  key={transaction.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-4 border-l-4 border-l-red-500 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={transaction.isPaid}
                        onChange={() => onTogglePaid(transaction.id)}
                        className="custom-checkbox w-5 h-5 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xl font-bold text-secondary-900 font-mono">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-secondary-400 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(transaction.date)}</span>
                          </div>
                          {transaction.notes && (
                            <p className="text-sm text-secondary-600 mt-2 bg-secondary-50 inline-block px-2 py-1 rounded-md">
                              {transaction.notes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="p-2 text-secondary-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Paid Bills Section */}
      {allPaid.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              পরিশোধিত বিল ({allPaid.length})
            </h3>
            <button
              onClick={onDeleteAllPaid}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-50 text-secondary-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all text-xs font-semibold border border-secondary-200 hover:border-red-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              সব মুছুন
            </button>
          </div>

          <div className="grid gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {allPaid.map((transaction) => (
              <div
                key={transaction.id}
                className="glass-card p-4 border-l-4 border-l-primary-500 bg-secondary-50/50"
              >
                <div className="flex items-center gap-4">
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={transaction.isPaid}
                      onChange={() => onTogglePaid(transaction.id)}
                      className="custom-checkbox w-5 h-5 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-primary-700 line-through decoration-2 font-mono">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-secondary-400 mt-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{formatDateTime(transaction.date)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="p-2 text-secondary-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
