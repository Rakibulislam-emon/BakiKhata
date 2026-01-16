"use client";

import { useTransactionsContext } from "@/context/TransactionsContext";
import { SummaryCards } from "@/components/SummaryCards";
import { RecentTransactions } from "@/components/RecentTransactions";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";
import { useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const {
    transactions,
    loading,
    deleteTransaction,
    clearRecent,
    openAddModal,
  } = useTransactionsContext();

  const totalBaki = useMemo(
    () =>
      transactions
        .filter((t) => !t.isPaid && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalDena = useMemo(
    () =>
      transactions
        .filter((t) => !t.isPaid && t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalPaid = useMemo(
    () =>
      transactions
        .filter((t) => t.isPaid && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const customerSummaries = useMemo(() => {
    const customerMap = new Map<string, any[]>();
    transactions.forEach((transaction) => {
      const name = transaction.customerName.toLowerCase().trim();
      if (!customerMap.has(name)) customerMap.set(name, []);
      customerMap.get(name)!.push(transaction);
    });
    return customerMap.size;
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return transactions
      .filter((t) => !t.isHiddenFromRecent)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const handleDeleteTransaction = (id: string) => {
    toast("আপনি কি নিশ্চিত যে এই লেনদেন মুছে ফেলতে চান?", {
      action: {
        label: "মুছুন",
        onClick: async () => {
          const res = await deleteTransaction(id);
          if (res.error) {
            toast.error("মুছতে সমস্যা হয়েছে");
          } else {
            toast.success("লেনদেন মুছে ফেলা হয়েছে");
          }
        },
      },
    });
  };

  const handleClearRecent = () => {
    toast("সাম্প্রতিক তালিকা পরিষ্কার করতে চান?", {
      description: "মূল হিসাব ঠিক থাকবে, শুধু তালিকা পরিষ্কার হবে।",
      action: {
        label: "পরিষ্কার করুন",
        onClick: async () => {
          const recentIds = recentTransactions.map((t) => t.id);
          const res = await clearRecent(recentIds);
          if (res.error) {
            toast.error("সমস্যা হয়েছে");
          } else {
            toast.success("সাম্প্রতিক তালিকা পরিষ্কার করা হয়েছে");
          }
        },
      },
    });
  };

  if (loading && transactions.length === 0) {
    return <FullPageLoader />;
  }

  return (
    <div className="space-y-8">
      <div className="hidden md:flex justify-end gap-4">
        <button
          onClick={openAddModal}
          className="btn-primary w-full md:w-auto py-4 md:py-2.5 text-lg md:text-sm font-semibold shadow-xl md:shadow-none justify-center active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 md:w-5 md:h-5" />
          নতুন লেনদেন
        </button>
      </div>

      <SummaryCards
        totalBaki={totalBaki}
        totalDena={totalDena}
        totalPaid={totalPaid}
        transactionCount={transactions.length}
        customerCount={customerSummaries}
      />

      <RecentTransactions
        transactions={recentTransactions}
        onClearRecent={handleClearRecent}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  );
}
