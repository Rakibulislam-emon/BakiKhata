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
} from "lucide-react";

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
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <p className="text-green-100 text-sm">সম্পূর্ণ লেনদেনের তালিকা</p>
            </div>
          </div>
          <button
            onClick={onDeleteAll}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
            title="সব মুছুন"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-center mb-4">
            <p className="text-green-100">বর্তমান বাকি</p>
            <p className="text-5xl font-bold">
              {formatCurrency(totals.totalBaki)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-green-200 text-sm">মোট বিল</p>
              <p className="text-xl font-bold">
                {customer.transactions.length}টি
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-green-200 text-sm">বাকি আছে</p>
              <p className="text-xl font-bold">{totals.unpaidCount}টি</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-green-200 text-sm">পরিশোধিত</p>
              <p className="text-xl font-bold">{totals.paidCount}টি</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Bill Form */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            নতুন বিল যোগ করুন
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
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
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              যোগ করুন
            </button>
          </form>
        </div>
      </div>

      {/* Unpaid Bills Section */}
      {allUnpaid.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              বাকি বিল ({allUnpaid.length}টি)
            </h3>
            <button
              onClick={onToggleAllPaid}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
            >
              {canSelectAll ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              সব পরিশোধ করুন
            </button>
          </div>

          <div className="space-y-3">
            {allUnpaid.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl p-4 shadow-card border-l-4 border-red-500"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={transaction.isPaid}
                    onChange={() => onTogglePaid(transaction.id)}
                    className="w-6 h-6 rounded border-2 border-red-500 text-red-500 focus:ring-red-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(transaction.date)}</span>
                        </div>
                        {transaction.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            📝 {transaction.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                          title="মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid Bills Section */}
      {allPaid.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              পরিশোধিত বিল ({allPaid.length}টি)
            </h3>
            <button
              onClick={onDeleteAllPaid}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              সব মুছুন
            </button>
          </div>

          <div className="space-y-3">
            {allPaid.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl p-4 shadow-card border-l-4 border-green-500 opacity-75"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={transaction.isPaid}
                    onChange={() => onTogglePaid(transaction.id)}
                    className="w-6 h-6 rounded border-2 border-green-500 text-green-500 focus:ring-green-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-green-600 line-through">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(transaction.date)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all"
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

      {/* All Clear Button */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <button
          onClick={onDeleteAll}
          className="w-full py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
        >
          <Trash2 className="w-5 h-5" />
          All Clear - এই গ্রাহকের সব বিল মুছুন
        </button>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} বাকি হিসাব</p>
      </footer>
    </div>
  );
};
