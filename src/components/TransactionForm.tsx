import React from "react";
import {
  Plus,
  User,
  FileText,
  X,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    amount: string;
    notes: string;
    type: "lend" | "borrow";
  };
  setFormData: (data: {
    name: string;
    amount: string;
    notes: string;
    type: "lend" | "borrow";
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TransactionForm = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
}: TransactionFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => onOpenChange(false)}
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
            {/* Header */}
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
                onClick={() => onOpenChange(false)}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Toggle */}
              <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "lend" })}
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
                  onClick={() => setFormData({ ...formData, type: "borrow" })}
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

              {/* Name Input */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  গ্রাহকের নাম
                </label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary-500 outline-none text-sm font-bold transition-all"
                    placeholder="নাম লিখুন..."
                  />
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  টাকার পরিমাণ
                </label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-300 group-focus-within:text-primary-500 transition-colors">
                    ৳
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary-500 outline-none text-lg font-black font-mono transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  বিবরণ (নোট)
                </label>
                <div className="relative group">
                  <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary-500 outline-none text-sm font-bold transition-all"
                    placeholder="নোট লিখুন..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full h-14 bg-primary-500 hover:bg-primary-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  নতুন লেনদেন যোগ করুন
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
