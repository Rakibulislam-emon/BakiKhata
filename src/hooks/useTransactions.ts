import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types";
import { getCurrentDateTime } from "@/lib/utils";

export const useTransactions = (session: any) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
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
    setLoading(false);
  }, [session]);

  const addTransaction = async (
    name: string,
    amountValue: string,
    notes: string
  ) => {
    if (!session) return { error: "No session" };

    const amount = parseFloat(amountValue);
    if (isNaN(amount) || amount <= 0) {
      return { error: "Invalid amount" };
    }

    const transactionData = {
      customer_name: name,
      amount,
      is_paid: false,
      date: getCurrentDateTime(),
      notes: notes.trim(),
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
      return { error };
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
      return { data: newTransaction };
    }
    return { error: "Unknown error" };
  };

  const togglePaid = async (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    const newStatus = !transaction.isPaid;

    // Optimistic update
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPaid: newStatus } : t))
    );

    const { error } = await supabase
      .from("transactions")
      .update({ is_paid: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating transaction:", error);
      // Revert
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isPaid: !newStatus } : t))
      );
      return { error };
    }
    return { success: true };
  };

  const deleteTransaction = async (id: string) => {
    const previousTransactions = [...transactions];
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting transaction:", error);
      setTransactions(previousTransactions);
      return { error };
    }
    return { success: true };
  };

  const deleteAllForCustomer = async (customerName: string) => {
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
      console.error("Error deleting all transactions:", error);
      setTransactions(previousTransactions);
      return { error };
    }
    return { success: true };
  };

  const toggleAllPaidForCustomer = async (
    customerName: string,
    shouldBePaid: boolean
  ) => {
    const previousTransactions = [...transactions];
    setTransactions((prev) =>
      prev.map((t) =>
        t.customerName.toLowerCase() === customerName.toLowerCase()
          ? { ...t, isPaid: shouldBePaid }
          : t
      )
    );

    const { error } = await supabase
      .from("transactions")
      .update({ is_paid: shouldBePaid })
      .ilike("customer_name", customerName);

    if (error) {
      console.error("Error updating all paid:", error);
      setTransactions(previousTransactions);
      return { error };
    }
    return { success: true };
  };

  const deleteAllPaidForCustomer = async (customerName: string) => {
    const previousTransactions = [...transactions];
    setTransactions((prev) =>
      prev.filter(
        (t) =>
          !(
            t.customerName.toLowerCase() === customerName.toLowerCase() &&
            t.isPaid
          )
      )
    );

    const { error } = await supabase
      .from("transactions")
      .delete()
      .match({ is_paid: true })
      .ilike("customer_name", customerName);

    if (error) {
      console.error("Error deleting all paid:", error);
      setTransactions(previousTransactions);
      return { error };
    }
    return { success: true };
  };

  const clearRecent = async (recentIds: string[]) => {
    const previousTransactions = [...transactions];
    setTransactions((prev) =>
      prev.map((t) =>
        recentIds.includes(t.id) ? { ...t, isHiddenFromRecent: true } : t
      )
    );

    const { error } = await supabase
      .from("transactions")
      .update({ is_hidden_from_recent: true })
      .in("id", recentIds);

    if (error) {
      console.error("Error clearing recent:", error);
      setTransactions(previousTransactions);
      return { error };
    }
    return { success: true };
  };

  return {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    togglePaid,
    deleteTransaction,
    deleteAllForCustomer,
    toggleAllPaidForCustomer,
    deleteAllPaidForCustomer,
    clearRecent,
    setTransactions,
  };
};
