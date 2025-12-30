import React from "react";
import { Plus, X } from "lucide-react";

interface TransactionFormProps {
  formData: {
    name: string;
    amount: string;
    notes: string;
  };
  setFormData: (data: { name: string; amount: string; notes: string }) => void;
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
    <div className="max-w-4xl mx-auto px-4 mt-4">
      <div className="bg-white rounded-xl p-6 shadow-card">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          নতুন বিল যোগ করুন
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              গ্রাহকের নাম *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="উদাহরণ: রাকিব"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              টাকার পরিমাণ (টাকা) *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              নোট (ঐচ্ছিক)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="অতিরিক্ত তথ্য..."
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              যোগ করুন
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
