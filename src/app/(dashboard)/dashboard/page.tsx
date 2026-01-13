"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { SummaryCards } from "@/components/SummaryCards";
import { RecentTransactions } from "@/components/RecentTransactions";
import { TransactionForm } from "@/components/TransactionForm";
import { useMemo, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const { session } = useAuth();
  const {
    transactions,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    clearRecent,
    setTransactions,
  } = useTransactions(session);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    notes: "",
    type: "lend" as "lend" | "borrow",
  });

  useEffect(() => {
    if (session) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [session, fetchTransactions, setTransactions]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      toast.error("অনুগ্রহ করে নাম এবং টাকার পরিমাণ দিন");
      return;
    }

    const res = await addTransaction({
      customerName: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      notes: formData.notes,
    });

    if (res.error) {
      // res.error might be a string or object depending on previous edits
      // ensuring it's handled gracefully
      const errorMessage =
        typeof res.error === "string" ? res.error : "Failed to add transaction";
      toast.error(errorMessage);
    } else {
      toast.success("লেনদেন সফলভাবে যোগ করা হয়েছে");
      setShowAddForm(false);
      setFormData({
        name: "",
        amount: "",
        notes: "",
        type: "lend",
      });
    }
  };

  const totalBaki = useMemo(
    () =>
      transactions
        .filter((t) => !t.isPaid && t.amount > 0)
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">ড্যাশবোর্ড</h1>
          <p className="text-secondary-500">আপনার ব্যবসার সংক্ষিপ্তসার</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          নতুন লেনদেন
        </button>
      </div>

      <TransactionForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddTransaction}
      />

      <SummaryCards
        totalBaki={totalBaki}
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
