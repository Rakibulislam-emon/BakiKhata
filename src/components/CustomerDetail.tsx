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
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  Calendar,
  Settings,
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
    updates: { amount?: number; notes?: string; type?: "lend" | "borrow" },
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
    }>,
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

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 25, stiffness: 200 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden"
    >
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-1000 ${totals.totalBaki >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"}`}
        />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/5 blur-[120px]" />
      </div>

      {/* Main Page Content */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 py-4 px-4 sm:px-6 mb-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/5 shadow-sm hover:text-primary-500 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                  {customer.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                  <Wallet className="w-3 h-3" />
                  লেনদেনের হিসাব
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onDeleteAll}
                className="p-2.5 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                title="সব মুছুন"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Hero Section & Bento Stats */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl mx-auto px-4 sm:px-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Primary Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-8 bg-white/95 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/20 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000 pointer-events-none ${totals.totalBaki >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"}`}
              />

              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
                  বর্তমান মোট বাকি
                </p>
                <div className="flex flex-col">
                  <span
                    className={`text-6xl md:text-7xl font-black font-mono tracking-tighter tabular-nums mb-4 drop-shadow-sm ${totals.totalBaki >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                  >
                    {formatCurrency(Math.abs(totals.totalBaki))}
                  </span>
                  <div className="flex items-center gap-3">
                    {totals.totalBaki >= 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest ring-1 ring-emerald-500/20">
                        <TrendingUp className="w-4 h-4" />
                        পাওনা
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest ring-1 ring-rose-500/20">
                        <TrendingDown className="w-4 h-4" />
                        দেনা
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Secondary Stats Column */}
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 dark:border-white/5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-primary-500 transition-colors">
                  মোট লেনদেন
                </p>
                <p className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                  {customer.transactions.length}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 dark:border-white/5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-emerald-500 transition-colors">
                  পরিশোধিত
                </p>
                <p className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                  {totals.paidCount}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Transaction Lists */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 mb-20 space-y-12"
        >
          {/* Ongoing Transactions */}
          <section>
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  চলমান লেনদেন ({allUnpaid.length})
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleAllPaid}
                className="px-4 py-2 rounded-xl bg-primary-500/10 hover:bg-primary-500 text-primary-500 hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest border border-primary-500/20"
              >
                সব পরিশোধ করুন
              </motion.button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {allUnpaid.map((transaction, index) => (
                  <motion.div
                    layout
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      damping: 20,
                      stiffness: 300,
                    }}
                    className="group relative bg-white/90 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500"
                  >
                    {editingId === transaction.id ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex-1 flex flex-col gap-6 p-1 sm:p-2"
                      >
                        {/* Header/Title for Edit Mode */}
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                              <Settings className="w-4 h-4 text-primary-500" />
                            </div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                              লেনদেন সংশোধন
                            </h4>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                            ID: {transaction.id.slice(0, 8)}
                          </span>
                        </div>

                        <div className="flex flex-col gap-6">
                          {/* Row 1: Type Toggle */}
                          <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              লেনদেনের ধরণ
                            </label>
                            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner w-full sm:w-64">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditForm({ ...editForm, type: "lend" })
                                }
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black rounded-xl transition-all ${
                                  editForm.type === "lend"
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                    : "text-slate-500 hover:text-emerald-500"
                                }`}
                              >
                                <TrendingUp className="w-4 h-4" />
                                পাওনা
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditForm({ ...editForm, type: "borrow" })
                                }
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black rounded-xl transition-all ${
                                  editForm.type === "borrow"
                                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                                    : "text-slate-500 hover:text-rose-500"
                                }`}
                              >
                                <TrendingDown className="w-4 h-4" />
                                দেনা
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Amount field */}
                          <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              টাকার পরিমাণ
                            </label>
                            <div className="relative group">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-primary-500 transition-colors">
                                ৳
                              </span>
                              <input
                                type="number"
                                value={editForm.amount}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    amount: e.target.value,
                                  })
                                }
                                className="w-full h-14 pl-14 pr-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary-500 outline-none text-xl font-black font-mono transition-all"
                                placeholder="0"
                              />
                            </div>
                          </div>

                          {/* Row 3: Notes field */}
                          <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              বিবরণ (নোট)
                            </label>
                            <div className="relative group">
                              <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                              <input
                                type="text"
                                value={editForm.notes}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    notes: e.target.value,
                                  })
                                }
                                className="w-full h-14 pl-16 pr-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary-500 outline-none text-sm font-bold transition-all"
                                placeholder="নোট লিখুন..."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                          <button
                            onClick={cancelEditing}
                            className="flex-1 h-12 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all border border-slate-200 dark:border-white/5"
                          >
                            <X className="w-4 h-4" />
                            বাতিল
                          </button>
                          <button
                            onClick={() => saveEditing(transaction.id)}
                            className="flex-[2] h-12 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-primary-500 hover:bg-primary-600 rounded-2xl transition-all shadow-lg shadow-primary-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            সেভ করুন
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        <div className="flex items-center gap-6">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => onTogglePaid(transaction.id)}
                            className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 shadow-sm ${
                              transaction.amount >= 0
                                ? "bg-emerald-50 text-emerald-600 ring-2 ring-emerald-100 hover:bg-emerald-500 hover:text-white"
                                : "bg-rose-50 text-rose-600 ring-2 ring-rose-100 hover:bg-rose-500 hover:text-white"
                            }`}
                          >
                            <Square className="w-7 h-7" />
                          </motion.button>

                          <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-3">
                              <span
                                className={`text-3xl font-black font-mono tracking-tighter tabular-nums ${transaction.amount >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                              >
                                {formatCurrency(Math.abs(transaction.amount))}
                              </span>
                              <span
                                className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg ${transaction.amount >= 0 ? "bg-emerald-100/50 text-emerald-700" : "bg-rose-100/50 text-rose-700"}`}
                              >
                                {transaction.amount >= 0 ? "পাওনা" : "দেনা"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                              <span className="flex items-center gap-1.5 border-r border-slate-200 dark:border-white/10 pr-4">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDateTime(transaction.date)}
                              </span>
                              {transaction.notes && (
                                <span className="flex items-center gap-1.5 opacity-80">
                                  <FileText className="w-3.5 h-3.5" />
                                  {transaction.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {editingId !== transaction.id && (
                      <div className="flex items-center gap-1 ml-auto sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:transform sm:translate-x-2 sm:group-hover:translate-x-0">
                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(59, 130, 246, 0.08)",
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEditing(transaction)}
                          className="p-1.5 sm:p-2.5 text-slate-400 hover:text-primary-500 rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(239, 68, 68, 0.08)",
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="p-1.5 sm:p-2.5 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Resolved Transactions */}
          {allPaid.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 px-2 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    নিষ্পন্ন লেনদেন ({allPaid.length})
                  </h3>
                </div>
                <button
                  onClick={onDeleteAllPaid}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                >
                  সব মুছুন
                </button>
              </div>

              <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity duration-500">
                {allPaid.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-slate-100/40 dark:bg-slate-900/40 rounded-[1.5rem] p-4 border border-slate-200/50 dark:border-white/5 flex items-center justify-between gap-4 grayscale hover:grayscale-0 transition-all duration-500"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onTogglePaid(transaction.id)}
                        className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                      <div>
                        <p className="text-lg font-black font-mono tracking-tighter text-slate-500 line-through decoration-2">
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          পরিশোধিত {formatDateTime(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>

      {/* Floating Action Button (FAB) */}
      <AnimatePresence>
        {!showAddForm && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddForm(true)}
            className="fixed bottom-24 right-6 z-[60] w-14 h-14 rounded-full bg-primary-500 text-white shadow-2xl shadow-primary-500/40 flex items-center justify-center group overflow-hidden sm:bottom-10 sm:right-10 sm:w-16 sm:h-16"
          >
            <motion.div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus className="w-8 h-8 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Add Transaction Modal & Bottom Sheet */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setShowAddForm(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[2.5rem] p-8 pb-32 sm:pb-10 border-t sm:border border-white/20 dark:border-white/5 shadow-2xl relative overflow-visible z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                    <Plus className="w-7 h-7 text-primary-500" />
                  </div>
                  নতুন লেনদেন
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddForm(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Type Toggle */}
              <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner mb-8">
                <button
                  type="button"
                  onClick={() => setFormData({ type: "lend" })}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black rounded-xl transition-all duration-300 ${
                    formData.type === "lend"
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "text-slate-500 hover:text-emerald-500"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  পাওনা
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ type: "borrow" })}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black rounded-xl transition-all duration-300 ${
                    formData.type === "borrow"
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                      : "text-slate-500 hover:text-rose-500"
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  দেনা
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  onSubmit(e);
                  setShowAddForm(false);
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                    টাকার পরিমাণ
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-primary-500 transition-colors">
                      ৳
                    </span>
                    <input
                      type="number"
                      autoFocus
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full pl-14 pr-8 py-5 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-primary-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-mono text-2xl font-black tracking-tighter"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                    বিবরণ (ঐচ্ছিক)
                  </label>
                  <div className="relative group">
                    <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="নোট লিখুন..."
                      className="w-full pl-16 pr-8 py-5 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:border-primary-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className={`w-full py-5 rounded-[1.5rem] font-black text-white text-base shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                      formData.type === "lend"
                        ? "bg-emerald-500 shadow-emerald-500/40 hover:bg-emerald-600"
                        : "bg-rose-500 shadow-rose-500/40 hover:bg-rose-600"
                    }`}
                  >
                    <Plus className="w-6 h-6" />
                    যোগ করুন
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
