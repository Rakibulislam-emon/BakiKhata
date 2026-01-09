import React from "react";
import { Plus, X, User, DollarSign, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface TransactionFormProps {
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
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TransactionForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: TransactionFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4 mt-6"
    >
      <div className="glass-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary-900">
            নতুন লেনদেন যোগ করুন
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-red-50 text-secondary-400 hover:text-red-500 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div className="flex bg-secondary-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "lend" })}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                formData.type === "lend"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-secondary-500 hover:text-secondary-700"
              }`}
            >
              আমি দিয়েছি (পাওনা)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "borrow" })}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                formData.type === "borrow"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-secondary-500 hover:text-secondary-700"
              }`}
            >
              আমি নিয়েছি (দেনা)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2 ml-1">
                নাম *
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="উদাহরণ: রাকিব"
                  className="input-field"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2 ml-1">
                টাকার পরিমাণ (টাকা) *
              </label>
              <div className="relative group">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="input-field font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2 ml-1">
              নোট (ঐচ্ছিক)
            </label>
            <div className="relative group">
              <FileText className="absolute left-3.5 top-3.5 text-secondary-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="অতিরিক্ত তথ্য..."
                rows={2}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="submit" className="flex-1 btn-primary">
              <Plus className="w-5 h-5" />
              যোগ করুন
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 btn-outline border-secondary-200 text-secondary-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
