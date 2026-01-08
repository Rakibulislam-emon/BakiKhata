"use client";

import { supabase } from "../lib/supabase";
import { useState, useEffect, useMemo } from "react";
import { Plus, Search, LogOut } from "lucide-react";
import Footer from "@/components/Footer";
import { Transaction, CustomerSummary } from "@/types";
import { getCurrentDateTime, formatCurrency } from "@/lib/utils";

import { Notification } from "@/components/Notification";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { CustomerList } from "@/components/CustomerList";
import { RecentTransactions } from "@/components/RecentTransactions";
import { CustomerDetail } from "@/components/CustomerDetail";
import { Auth } from "@/components/Auth";

export default function Home() {
  // Session State
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // App State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  // Load Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load transactions when session exists
  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session]);

  const handleLogout = async () => {
    if (confirm("আপনি কি নিশ্চিত যে লগআউট করতে চান?")) {
      await supabase.auth.signOut();
      setTransactions([]);
      setSelectedCustomerName(null);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      showNotification("error", "ডাটা লোড করতে সমস্যা হয়েছে");
      return;
    }

    if (data) {
      const mappedTransactions: Transaction[] = data.map((t) => ({
        id: t.id,
        customerName: t.customer_name,
        amount: t.amount,
        isPaid: t.is_paid,
        date: t.date,
        notes: t.notes,
        createdAt: t.created_at,
        isHiddenFromRecent: t.is_hidden_from_recent,
      }));
      setTransactions(mappedTransactions);
    }
  };

  // Show notification
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Add new transaction
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const nameToUse = selectedCustomerName || formData.name.trim();

    if (!nameToUse || !formData.amount) {
      showNotification("error", "দয়া করে নাম এবং টাকার পরিমাণ লিখুন");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showNotification("error", "সঠিক টাকার পরিমাণ লিখুন");
      return;
    }

    const transactionData = {
      customer_name: nameToUse,
      amount,
      is_paid: false,
      date: getCurrentDateTime(),
      notes: formData.notes.trim(),
      created_at: getCurrentDateTime(),
      is_hidden_from_recent: false,
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
      showNotification("error", "বিল যোগ করতে সমস্যা হয়েছে");
      return;
    }

    if (data) {
      const newTransaction: Transaction = {
        id: data.id,
        customerName: data.customer_name,
        amount: data.amount,
        isPaid: data.is_paid,
        date: data.date,
        notes: data.notes,
        createdAt: data.created_at,
        isHiddenFromRecent: data.is_hidden_from_recent,
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      setFormData((prev) => ({ ...prev, amount: "", notes: "" }));
      if (!selectedCustomerName) {
        setFormData({ name: "", amount: "", notes: "" });
      }
      setShowAddForm(false);
      showNotification("success", "বিল যোগ হয়েছে");
    }
  };

  // Toggle single transaction paid status
  const togglePaid = async (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    const newStatus = !transaction.isPaid;

    // Optimistic update
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, isPaid: newStatus };
        }
        return t;
      })
    );

    const { error } = await supabase
      .from("transactions")
      .update({ is_paid: newStatus })
      .eq("id", id); // RLS ensures user only updates their own

    if (error) {
      console.error("Error updating transaction:", error);
      showNotification("error", "আপডেট করতে সমস্যা হয়েছে");
      // Revert optimistic update
      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            return { ...t, isPaid: !newStatus };
          }
          return t;
        })
      );
    }
  };

  // Select/Deselect all unpaid transactions for a customer
  const toggleAllPaid = async () => {
    if (!selectedCustomerName) return;

    const customerData = getCustomerData(selectedCustomerName);
    const allUnpaid = customerData.transactions.filter((t) => !t.isPaid);
    const shouldSelectAll = allUnpaid.length > 0;

    // Optimistic
    setTransactions((prev) =>
      prev.map((t) => {
        if (
          t.customerName.toLowerCase() === selectedCustomerName.toLowerCase()
        ) {
          return { ...t, isPaid: shouldSelectAll };
        }
        return t;
      })
    );

    const { error } = await supabase
      .from("transactions")
      .update({ is_paid: shouldSelectAll })
      .ilike("customer_name", selectedCustomerName);

    if (error) {
      console.error("Error updating all:", error);
      showNotification("error", "আপডেট করতে সমস্যা হয়েছে");
      fetchTransactions();
    }
  };

  // Delete single transaction
  const deleteTransaction = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত যে এই বিল মুছে ফেলতে চান?")) {
      // Optimistic update
      const previousTransactions = [...transactions];
      setTransactions((prev) => prev.filter((t) => t.id !== id));

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting transaction:", error);
        showNotification("error", "মুছতে সমস্যা হয়েছে");
        setTransactions(previousTransactions);
      } else {
        showNotification("success", "বিল মুছে ফেলা হয়েছে");
      }
    }
  };

  // Delete all transactions for a customer (All Clear)
  const deleteAllTransactions = async () => {
    if (!selectedCustomerName) return;

    const customerName = selectedCustomerName;
    if (
      !confirm(`আপনি কি নিশ্চিত যে ${customerName}-এর সব বিল মুছে ফেলতে চান?`)
    ) {
      return;
    }

    // Optimistic
    const previousTransactions = [...transactions];
    setTransactions((prev) =>
      prev.filter(
        (t) => t.customerName.toLowerCase() !== customerName.toLowerCase()
      )
    );

    const { error } = await supabase
      .from("transactions")
      .delete()
      .ilike("customer_name", customerName);

    if (error) {
      console.error("Error deleting all:", error);
      showNotification("error", "মুছতে সমস্যা হয়েছে");
      setTransactions(previousTransactions);
    } else {
      setSelectedCustomerName(null);
      showNotification("success", "সব বিল মুছে ফেলা হয়েছে");
    }
  };

  // Delete all PAID transactions for a customer
  const deleteAllPaidTransactions = async () => {
    if (!selectedCustomerName) return;
    if (
      !confirm(
        `আপনি কি নিশ্চিত যে ${selectedCustomerName}-এর সব পরিশোধিত বিল মুছে ফেলতে চান?`
      )
    ) {
      return;
    }

    // Optimistic
    const previousTransactions = [...transactions];
    setTransactions((prev) =>
      prev.filter(
        (t) =>
          !(
            t.customerName.toLowerCase() ===
              selectedCustomerName.toLowerCase() && t.isPaid
          )
      )
    );

    const { error } = await supabase
      .from("transactions")
      .delete()
      .match({ is_paid: true })
      .ilike("customer_name", selectedCustomerName);

    if (error) {
      console.error("Error deleting all paid:", error);
      showNotification("error", "মুছতে সমস্যা হয়েছে");
      setTransactions(previousTransactions);
    } else {
      showNotification("success", "সব পরিশোধিত বিল মুছে ফেলা হয়েছে");
    }
  };

  // Clear recent transactions (Hide from view)
  const clearRecentTransactions = async () => {
    if (
      confirm(
        "আপনি কি নিশ্চিত যে সাম্প্রতিক লেনদেনের তালিকা মুছে ফেলতে চান? (মূল হিসাব ঠিক থাকবে)"
      )
    ) {
      const recentIds = recentTransactions.map((t) => t.id);

      // Optimistic
      setTransactions((prev) =>
        prev.map((t) => {
          if (recentIds.includes(t.id)) {
            return { ...t, isHiddenFromRecent: true };
          }
          return t;
        })
      );

      const { error } = await supabase
        .from("transactions")
        .update({ is_hidden_from_recent: true })
        .in("id", recentIds);

      if (error) {
        console.error("Error clearing recent:", error);
        showNotification("error", "সমস্যা হয়েছে");
        fetchTransactions();
      } else {
        showNotification("success", "সাম্প্রতিক তালিকা পরিষ্কার করা হয়েছে");
      }
    }
  };

  // Get customer summaries
  const customerSummaries = useMemo(() => {
    const customerMap = new Map<string, Transaction[]>();

    transactions.forEach((transaction) => {
      const name = transaction.customerName.toLowerCase().trim();
      if (!customerMap.has(name)) {
        customerMap.set(name, []);
      }
      customerMap.get(name)!.push(transaction);
    });

    const summaries: CustomerSummary[] = [];

    customerMap.forEach((txns, name) => {
      const sortedTxns = txns.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      summaries.push({
        name: txns[0].customerName, // Use original casing
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

  // Get selected customer data
  const selectedCustomerData = useMemo(() => {
    if (!selectedCustomerName) return null;

    const txns = transactions.filter(
      (t) => t.customerName.toLowerCase() === selectedCustomerName.toLowerCase()
    );

    if (txns.length === 0) return null;

    const sortedTxns = txns.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      name: txns[0].customerName,
      transactions: sortedTxns,
    };
  }, [selectedCustomerName, transactions]);

  // Helper function to get customer data
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
      lastTransaction: sortedTxns[0]?.date || "",
    };
  };

  // Calculate customer totals
  const customerTotals = useMemo(() => {
    if (!selectedCustomerData) return null;

    const totalBaki = selectedCustomerData.transactions
      .filter((t) => !t.isPaid)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPaid = selectedCustomerData.transactions
      .filter((t) => t.isPaid)
      .reduce((sum, t) => sum + t.amount, 0);

    const unpaidCount = selectedCustomerData.transactions.filter(
      (t) => !t.isPaid
    ).length;
    const paidCount = selectedCustomerData.transactions.filter(
      (t) => t.isPaid
    ).length;

    return { totalBaki, totalPaid, unpaidCount, paidCount };
  }, [selectedCustomerData]);

  // Get recent transactions
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

  // Global totals
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If not logged in, show Auth Screen
  if (!session) {
    return <Auth />;
  }

  // Render Dashboard
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
          onDeleteAll={deleteAllTransactions}
          onToggleAllPaid={toggleAllPaid}
          onTogglePaid={togglePaid}
          onDeleteTransaction={deleteTransaction}
          onDeleteAllPaid={deleteAllPaidTransactions}
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

      {/* Header */}
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

      {/* Summary Cards */}
      <SummaryCards
        totalBaki={totalBaki}
        totalPaid={totalPaid}
        transactionCount={transactions.length}
        customerCount={customerSummaries.length}
      />

      {/* Search */}
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

      {/* Add Button */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          নতুন বিল যোগ করুন
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <TransactionForm
          formData={formData}
          setFormData={(data) => setFormData({ ...formData, ...data })}
          onSubmit={handleSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Customer List */}
      <CustomerList
        customerSummaries={customerSummaries}
        searchTerm={searchTerm}
        onSelectCustomer={setSelectedCustomerName}
      />

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={recentTransactions}
        onClearRecent={clearRecentTransactions}
        onDeleteTransaction={deleteTransaction}
      />

      
    </div>
  );
}
