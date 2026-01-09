"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, LogOut } from "lucide-react";
import { Transaction, CustomerSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";

import { Notification } from "@/components/Notification";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { CustomerList } from "@/components/CustomerList";
import { RecentTransactions } from "@/components/RecentTransactions";
import { CustomerDetail } from "@/components/CustomerDetail";
import { Auth } from "@/components/Auth";

import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";

export default function Home() {
  const { session, loading: authLoading, logout } = useAuth();
  const {
    transactions,
    loading: txLoading,
    fetchTransactions,
    addTransaction,
    togglePaid,
    deleteTransaction,
    deleteAllForCustomer,
    toggleAllPaidForCustomer,
    deleteAllPaidForCustomer,
    clearRecent,
    setTransactions,
  } = useTransactions(session);

  // UI State
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    notes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
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

  const handleLogout = async () => {
    if (confirm("আপনি কি নিশ্চিত যে লগআউট করতে চান?")) {
      await logout();
      setSelectedCustomerName(null);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = selectedCustomerName || formData.name.trim();

    if (!nameToUse || !formData.amount) {
      showNotification("error", "দয়া করে নাম এবং টাকার পরিমাণ লিখুন");
      return;
    }

    const res = await addTransaction(
      nameToUse,
      formData.amount,
      formData.notes
    );

    if (res.error) {
      showNotification("error", "বিল যোগ করতে সমস্যা হয়েছে");
    } else {
      setFormData((prev) => ({ ...prev, amount: "", notes: "" }));
      if (!selectedCustomerName) {
        setFormData({ name: "", amount: "", notes: "" });
      }
      setShowAddForm(false);
      showNotification("success", "বিল যোগ হয়েছে");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত যে এই বিল মুছে ফেলতে চান?")) {
      const res = await deleteTransaction(id);
      if (res.error) {
        showNotification("error", "মুছতে সমস্যা হয়েছে");
      } else {
        showNotification("success", "বিল মুছে ফেলা হয়েছে");
      }
    }
  };

  const handleDeleteAllTransactions = async () => {
    if (!selectedCustomerName) return;
    if (
      !confirm(
        `আপনি কি নিশ্চিত যে ${selectedCustomerName}-এর সব বিল মুছে ফেলতে চান?`
      )
    )
      return;

    const res = await deleteAllForCustomer(selectedCustomerName);
    if (res.error) {
      showNotification("error", "মুছতে সমস্যা হয়েছে");
    } else {
      setSelectedCustomerName(null);
      showNotification("success", "সব বিল মুছে ফেলা হয়েছে");
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
      showNotification("error", "আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const handleDeleteAllPaid = async () => {
    if (!selectedCustomerName) return;
    if (
      !confirm(
        `আপনি কি নিশ্চিত যে ${selectedCustomerName}-এর সব পরিশোধিত বিল মুছে ফেলতে চান?`
      )
    )
      return;

    const res = await deleteAllPaidForCustomer(selectedCustomerName);
    if (res.error) {
      showNotification("error", "মুছতে সমস্যা হয়েছে");
    } else {
      showNotification("success", "সব পরিশোধিত বিল মুছে ফেলা হয়েছে");
    }
  };

  const handleClearRecent = async () => {
    if (
      confirm(
        "আপনি কি নিশ্চিত যে সাম্প্রতিক লেনদেনের তালিকা মুছে ফেলতে চান? (মূল হিসাব ঠিক থাকবে)"
      )
    ) {
      const recentIds = recentTransactions.map((t) => t.id);
      const res = await clearRecent(recentIds);
      if (res.error) {
        showNotification("error", "সমস্যা হয়েছে");
      } else {
        showNotification("success", "সাম্প্রতিক তালিকা পরিষ্কার করা হয়েছে");
      }
    }
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
        .filter((t) => !t.isPaid)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const totalPaid = useMemo(
    () =>
      transactions
        .filter((t) => t.isPaid)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  if (selectedCustomerData && customerTotals) {
    return (
      <>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
        <CustomerDetail
          customer={selectedCustomerData}
          totals={customerTotals}
          onBack={() => setSelectedCustomerName(null)}
          onDeleteAll={handleDeleteAllTransactions}
          onToggleAllPaid={handleToggleAllPaid}
          onTogglePaid={togglePaid}
          onDeleteTransaction={handleDeleteTransaction}
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
    <div className="min-h-screen pb-20">
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📋 বাকি হিসাব</h1>
            <p className="text-green-100">
              {session.user.email} - এর হিসাব চলছে
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            title="লগ আউট"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <SummaryCards
        totalBaki={totalBaki}
        totalPaid={totalPaid}
        transactionCount={transactions.length}
        customerCount={customerSummaries.length}
      />

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="গ্রাহকের নাম খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          নতুন বিল যোগ করুন
        </button>
      </div>

      {showAddForm && (
        <TransactionForm
          formData={formData}
          setFormData={(data) => setFormData({ ...formData, ...data })}
          onSubmit={handleSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

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
  );
}
