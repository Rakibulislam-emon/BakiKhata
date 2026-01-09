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
  onUpdateTransaction: (
    id: string,
    updates: { amount?: number; notes?: string; type?: "lend" | "borrow" }
  ) => void;
  onDeleteAllPaid: () => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  formData: {
    name: string;
    amount: string;
    notes: string;
    type: "lend" | "borrow";
  };
  setFormData: (
    data: Partial<{
      name: string;
      amount: string;
      notes: string;
      type: "lend" | "borrow";
    }>
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
  onUpdateTransaction,
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

  // Add state for editing
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<{
    amount: string;
    notes: string;
    type: "lend" | "borrow";
  }>({ amount: "", notes: "", type: "lend" });

  const startEditing = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      amount: Math.abs(transaction.amount).toString(),
      notes: transaction.notes,
      type: transaction.amount > 0 ? "lend" : "borrow",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ amount: "", notes: "", type: "lend" });
  };

  const saveEditing = (id: string) => {
    if (!editForm.amount || parseFloat(editForm.amount) === 0) return;

    onUpdateTransaction(id, {
      amount: parseFloat(editForm.amount),
      notes: editForm.notes,
      type: editForm.type,
    });
    setEditingId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen pb-20 bg-slate-50"
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
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 text-secondary-900 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] relative overflow-hidden border border-white/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          <div className="relative z-10 text-center mb-10">
            <p className="text-secondary-600 text-sm font-semibold tracking-wide uppercase mb-2">
              বর্তমান বাকি
            </p>
            <div className="flex flex-col items-center">
              <p className="text-6xl font-bold font-mono tracking-tighter text-secondary-900 mb-3 drop-shadow-sm">
                {formatCurrency(Math.abs(totals.totalBaki))}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="group bg-white/50 hover:bg-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 text-center border border-white/60 shadow-sm backdrop-blur-sm">
              <p className="text-secondary-500 text-[10px] font-bold uppercase tracking-wider mb-1 group-hover:text-primary-600 transition-colors">
                মোট
              </p>
              <p className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors">
                {customer.transactions.length}
              </p>
            </div>
            <div className="group bg-white/50 hover:bg-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 text-center border border-white/60 shadow-sm backdrop-blur-sm">
              <p className="text-secondary-500 text-[10px] font-bold uppercase tracking-wider mb-1 group-hover:text-primary-600 transition-colors">
                বাকি আছে
              </p>
              <p className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors max-w-full overflow-hidden text-ellipsis px-1">
                {totals.unpaidCount}
              </p>
            </div>
            <div className="group bg-white/50 hover:bg-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 text-center border border-white/60 shadow-sm backdrop-blur-sm">
              <p className="text-secondary-500 text-[10px] font-bold uppercase tracking-wider mb-1 group-hover:text-primary-600 transition-colors">
                পরিশোধিত
              </p>
              <p className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors max-w-full overflow-hidden text-ellipsis px-1">
                {totals.paidCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Transaction Form */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-500" />
              নতুন লেনদেন
            </h2>
            <div className="flex bg-secondary-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setFormData({ type: "lend" })}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  formData.type === "lend"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-secondary-500 hover:text-emerald-600"
                }`}
              >
                পাওনা
              </button>
              <button
                type="button"
                onClick={() => setFormData({ type: "borrow" })}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  formData.type === "borrow"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-secondary-500 hover:text-red-600"
                }`}
              >
                দেনা
              </button>
            </div>
          </div>
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
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              চলমান লেনদেন ({allUnpaid.length})
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
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all ${
                    transaction.amount > 0
                      ? "bg-slate-50 border-emerald-100 hover:border-emerald-200 hover:shadow-sm"
                      : "bg-red-50/30 border-red-100 hover:border-red-200 hover:shadow-sm"
                  }`}
                >
                  {editingId === transaction.id ? (
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex bg-secondary-100 p-0.5 rounded-lg h-10 self-start sm:w-auto w-full justify-between sm:justify-start">
                          <button
                            type="button"
                            onClick={() =>
                              setEditForm({ ...editForm, type: "lend" })
                            }
                            className={`flex-1 sm:flex-none px-3 text-xs font-semibold rounded-md transition-all h-full ${
                              editForm.type === "lend"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-secondary-500 hover:text-emerald-600"
                            }`}
                          >
                            পাওনা
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setEditForm({ ...editForm, type: "borrow" })
                            }
                            className={`flex-1 sm:flex-none px-3 text-xs font-semibold rounded-md transition-all h-full ${
                              editForm.type === "borrow"
                                ? "bg-white text-red-600 shadow-sm"
                                : "text-secondary-500 hover:text-red-600"
                            }`}
                          >
                            দেনা
                          </button>
                        </div>
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) =>
                            setEditForm({ ...editForm, amount: e.target.value })
                          }
                          className="w-full sm:w-32 px-3 py-2 rounded-lg border border-secondary-200 text-sm focus:border-primary-500 outline-none"
                          placeholder="Amount"
                        />
                        <input
                          type="text"
                          value={editForm.notes}
                          onChange={(e) =>
                            setEditForm({ ...editForm, notes: e.target.value })
                          }
                          className="w-full sm:flex-1 px-3 py-2 rounded-lg border border-secondary-200 text-sm focus:border-primary-500 outline-none"
                          placeholder="Notes"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1.5 text-xs font-medium text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors border border-secondary-200"
                        >
                          বাতিল
                        </button>
                        <button
                          onClick={() => saveEditing(transaction.id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
                        >
                          সেভ করুন
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => onTogglePaid(transaction.id)}
                          className={`p-2 rounded-full transition-all duration-300 ${
                            transaction.amount > 0
                              ? "bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100 ring-4 ring-emerald-50/50"
                              : "bg-red-100/50 text-red-600 hover:bg-red-100 ring-4 ring-red-50/50"
                          }`}
                        >
                          <Square className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                        </button>
                        <div>
                          <p className="font-semibold text-secondary-900 flex items-center gap-2">
                            {formatCurrency(Math.abs(transaction.amount))}
                            {transaction.amount > 0 ? (
                              <span className="text-[10px] items-center px-2 py-0.5 rounded-full bg-emerald-100/50 text-emerald-700 font-bold tracking-wider border border-emerald-100 hidden sm:inline-flex">
                                পাওনা
                              </span>
                            ) : (
                              <span className="text-[10px] items-center px-2 py-0.5 rounded-full bg-red-100/50 text-red-700 font-bold tracking-wider border border-red-100 hidden sm:inline-flex">
                                দেনা
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-secondary-500 mt-0.5">
                            <span className="flex items-center gap-1 bg-secondary-50 px-1.5 py-0.5 rounded border border-secondary-100">
                              <Clock className="w-3 h-3" />
                              {formatDateTime(transaction.date)}
                            </span>
                            {transaction.notes && (
                              <span className="flex items-center gap-1 text-secondary-600 bg-secondary-50 px-1.5 py-0.5 rounded border border-secondary-100 max-w-[150px] truncate">
                                <FileText className="w-3 h-3" />
                                {transaction.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                        <button
                          onClick={() => startEditing(transaction)}
                          className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          title="এডিট"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-pencil w-4 h-4"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                          title="মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
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
              <div className="w-2 h-2 bg-slate-400 rounded-full" />
              নিষ্পন্ন ({allPaid.length})
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
                className="glass-card p-4 border-l-4 border-l-slate-400 bg-secondary-50/50"
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
                          {formatCurrency(Math.abs(transaction.amount))}
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
