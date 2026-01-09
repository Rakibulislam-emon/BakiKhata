"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, LogOut } from "lucide-react";
import { Transaction, CustomerSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";

import { SummaryCards } from "@/components/SummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { CustomerList } from "@/components/CustomerList";
import { RecentTransactions } from "@/components/RecentTransactions";
import { CustomerDetail } from "@/components/CustomerDetail";
import { Auth } from "@/components/Auth";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { session, loading: authLoading, logout } = useAuth();
  const {
    transactions,
    loading: txLoading,
    fetchTransactions,
    addTransaction,
    togglePaid,
    deleteTransaction,
    updateTransaction,
    deleteAllForCustomer,
    toggleAllPaidForCustomer,
    deleteAllPaidForCustomer,
    clearRecent,
    setTransactions,
  } = useTransactions(session);

  // UI State
  const [formData, setFormData] = useState<{
    name: string;
    amount: string;
    notes: string;
    type: "lend" | "borrow";
  }>({
    name: "",
    amount: "",
    notes: "",
    type: "lend",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState<
    string | null
  >(null);

  // Load transactions when session exists
  useEffect(() => {
    if (session) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [session, fetchTransactions, setTransactions]);

  const handleLogout = () => {
    toast("আপনি কি নিশ্চিত যে লগআউট করতে চান?", {
      action: {
        label: "লগআউট",
        onClick: async () => {
          await logout();
          setSelectedCustomerName(null);
        },
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = selectedCustomerName || formData.name.trim();

    if (!nameToUse || !formData.amount) {
      toast.error("দয়া করে নাম এবং টাকার পরিমাণ লিখুন");
      return;
    }

    const amountValue = parseFloat(formData.amount);
    const finalAmount = formData.type === "borrow" ? -amountValue : amountValue;

    const res = await addTransaction(
      nameToUse,
      finalAmount.toString(),
      formData.notes
    );

    if (res.error) {
      toast.error("বিল যোগ করতে সমস্যা হয়েছে");
    } else {
      setFormData((prev) => ({ ...prev, amount: "", notes: "" }));
      if (!selectedCustomerName) {
        setFormData({ name: "", amount: "", notes: "", type: "lend" });
      }
      setShowAddForm(false);
      toast.success("লেনদেন যোগ হয়েছে");
    }
  };

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
      cancel: { label: "বাতিল", onClick: () => {} },
    });
  };

  const handleDeleteAllTransactions = () => {
    if (!selectedCustomerName) return;
    toast(
      `আপনি কি নিশ্চিত যে ${selectedCustomerName}-এর সব লেনদেন মুছে ফেলতে চান?`,
      {
        action: {
          label: "সব মুছুন",
          onClick: async () => {
            const res = await deleteAllForCustomer(selectedCustomerName);
            if (res.error) {
              toast.error("মুছতে সমস্যা হয়েছে");
            } else {
              setSelectedCustomerName(null);
              toast.success("সব লেনদেন মুছে ফেলা হয়েছে");
            }
          },
        },
        cancel: { label: "বাতিল", onClick: () => {} },
      }
    );
  };

  const handleUpdateTransaction = async (
    id: string,
    updates: { amount?: number; notes?: string; type?: "lend" | "borrow" }
  ) => {
    // Determine sign based on type if provided, otherwise keep existing sign logic from amount
    let finalAmount = updates.amount;

    if (
      updates.type === "borrow" &&
      finalAmount !== undefined &&
      finalAmount > 0
    ) {
      finalAmount = -finalAmount;
    } else if (
      updates.type === "lend" &&
      finalAmount !== undefined &&
      finalAmount < 0
    ) {
      finalAmount = Math.abs(finalAmount);
    } else if (updates.type === "borrow" && finalAmount === undefined) {
      // If only type changed, we need to flip the sign of the existing transaction amount
      const existingTx = transactions.find((t) => t.id === id);
      if (existingTx && existingTx.amount > 0) finalAmount = -existingTx.amount;
    } else if (updates.type === "lend" && finalAmount === undefined) {
      const existingTx = transactions.find((t) => t.id === id);
      if (existingTx && existingTx.amount < 0)
        finalAmount = Math.abs(existingTx.amount);
    }

    // Sanitize updates to only include database columns
    const dbUpdates: { amount?: number; notes?: string } = {
      amount: finalAmount,
    };
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const res = await updateTransaction(id, dbUpdates);

    if (res?.error) {
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    } else {
      toast.success("লেনদেন আপডেট করা হয়েছে");
    }
  };

  const handleToggleAllPaid = async () => {
    if (!selectedCustomerName) return;
    const customerData = getCustomerData(selectedCustomerName);
    const allUnpaid = customerData.transactions.filter((t) => !t.isPaid);
    const shouldBePaid = allUnpaid.length > 0;

    const res = await toggleAllPaidForCustomer(
      selectedCustomerName,
      shouldBePaid
    );
    if (res.error) {
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const handleDeleteAllPaid = () => {
    if (!selectedCustomerName) return;
    toast(
      `আপনি কি নিশ্চিত যে ${selectedCustomerName}-এর সব নিষ্পন্ন লেনদেন মুছে ফেলতে চান?`,
      {
        action: {
          label: "মুছুন",
          onClick: async () => {
            const res = await deleteAllPaidForCustomer(selectedCustomerName);
            if (res.error) {
              toast.error("মুছতে সমস্যা হয়েছে");
            } else {
              toast.success("সব নিষ্পন্ন লেনদেন মুছে ফেলা হয়েছে");
            }
          },
        },
        cancel: { label: "বাতিল", onClick: () => {} },
      }
    );
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
      cancel: { label: "বাতিল", onClick: () => {} },
    });
  };

  // Memoized derived data
  const customerSummaries = useMemo(() => {
    const customerMap = new Map<string, Transaction[]>();
    transactions.forEach((transaction) => {
      const name = transaction.customerName.toLowerCase().trim();
      if (!customerMap.has(name)) customerMap.set(name, []);
      customerMap.get(name)!.push(transaction);
    });

    const summaries: CustomerSummary[] = [];
    customerMap.forEach((txns) => {
      const sortedTxns = txns.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      summaries.push({
        name: txns[0].customerName,
        transactions: sortedTxns,
        lastTransaction: sortedTxns[0]?.date || "",
      });
    });

    return summaries.sort(
      (a, b) =>
        new Date(b.lastTransaction).getTime() -
        new Date(a.lastTransaction).getTime()
    );
  }, [transactions]);

  const selectedCustomerData = useMemo(() => {
    if (!selectedCustomerName) return null;
    const txns = transactions.filter(
      (t) => t.customerName.toLowerCase() === selectedCustomerName.toLowerCase()
    );
    if (txns.length === 0) return null;
    return {
      name: txns[0].customerName,
      transactions: txns.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    };
  }, [selectedCustomerName, transactions]);

  const customerTotals = useMemo(() => {
    if (!selectedCustomerData) return null;
    const unpaid = selectedCustomerData.transactions.filter((t) => !t.isPaid);
    const paid = selectedCustomerData.transactions.filter((t) => t.isPaid);
    return {
      totalBaki: unpaid.reduce((sum, t) => sum + t.amount, 0),
      totalPaid: paid.reduce((sum, t) => sum + t.amount, 0),
      unpaidCount: unpaid.length,
      paidCount: paid.length,
    };
  }, [selectedCustomerData]);

  const getCustomerData = (name: string) => {
    const txns = transactions.filter(
      (t) => t.customerName.toLowerCase() === name.toLowerCase()
    );
    const sortedTxns = txns.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return {
      name: txns[0]?.customerName || name,
      transactions: sortedTxns,
    };
  };

  const recentTransactions = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !t.isHiddenFromRecent
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions, searchTerm]);

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  if (selectedCustomerData && customerTotals) {
    return (
      <>
        <CustomerDetail
          customer={selectedCustomerData}
          totals={customerTotals}
          onBack={() => setSelectedCustomerName(null)}
          onDeleteAll={handleDeleteAllTransactions}
          onToggleAllPaid={handleToggleAllPaid}
          onTogglePaid={togglePaid}
          onDeleteTransaction={handleDeleteTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onDeleteAllPaid={handleDeleteAllPaid}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          formData={formData}
          setFormData={(data) => setFormData({ ...formData, ...data })}
          onSubmit={handleSubmit}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <header className="bg-primary-600 text-white pb-24 pt-8 px-4 rounded-b-[2.5rem] shadow-2xl shadow-primary-900/10 relative overflow-hidden">
          {/* Header Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

          <div className="max-w-4xl mx-auto flex items-center justify-between relative z-10">
            <div>
              <h1 className="text-3xl font-bold mb-1 tracking-tight">
                📋 বাকি হিসাব
              </h1>
              <p className="text-primary-100/80 text-sm font-medium">
                {session.user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all shadow-lg shadow-black/5"
              title="লগ আউট"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </header>

        <SummaryCards
          totalBaki={totalBaki}
          totalPaid={totalPaid}
          transactionCount={transactions.length}
          customerCount={customerSummaries.length}
        />

        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="নাম অনুসন্ধান..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-md shadow-soft focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-secondary-400"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-6">
          <AnimatePresence mode="wait">
            {!showAddForm ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setShowAddForm(true)}
                className="w-full py-4 bg-white/50 hover:bg-white border-2 border-dashed border-secondary-300 rounded-2xl text-secondary-500 hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-2 font-medium backdrop-blur-sm group"
              >
                <div className="p-1 rounded-full bg-secondary-100 group-hover:bg-primary-100 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                নতুন লেনদেন যোগ করুন
              </motion.button>
            ) : (
              <TransactionForm
                formData={formData}
                setFormData={(data) => setFormData({ ...formData, ...data })}
                onSubmit={handleSubmit}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </AnimatePresence>
        </div>

        <CustomerList
          customerSummaries={customerSummaries}
          searchTerm={searchTerm}
          onSelectCustomer={setSelectedCustomerName}
        />
        <RecentTransactions
          transactions={recentTransactions}
          onClearRecent={handleClearRecent}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}
