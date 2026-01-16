import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types";
import { getCurrentDateTime } from "@/lib/utils";

export const useTransactions = (session: any) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", session.user.id)
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
        amount: Number(t.amount),
        isPaid: Boolean(t.is_paid),
        date: t.date,
        notes: t.notes,
        createdAt: t.created_at,
        isHiddenFromRecent: t.is_hidden_from_recent,
      }));
      setTransactions(mappedTransactions);
    }
    setLoading(false);
  }, [session]);

  const addTransaction = async ({
    customerName,
    amount,
    type,
    notes,
  }: {
    customerName: string;
    amount: number;
    type: "lend" | "borrow";
    notes: string;
  }) => {
    if (!session?.user?.id) return { error: "No session" };

    if (isNaN(amount) || amount === 0) {
      return { error: "Invalid amount" };
    }

    const finalAmount = type === "lend" ? Math.abs(amount) : -Math.abs(amount);

    const transactionData = {
      user_id: session.user.id,
      customer_name: customerName,
      amount: finalAmount,
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
      return { error: error.message };
    }

    if (data) {
      const newTransaction: Transaction = {
        id: data.id,
        customerName: data.customer_name,
        amount: Number(data.amount),
        isPaid: Boolean(data.is_paid),
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
      .eq("id", id)
      .eq("user_id", session?.user?.id);

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

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", session?.user?.id);

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
      .eq("user_id", session?.user?.id)
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
      .eq("user_id", session?.user?.id)
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
      .eq("user_id", session?.user?.id)
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
      .eq("user_id", session?.user?.id)
      .in("id", recentIds);

    if (error) {
      console.error("Error clearing recent:", error);
      setTransactions(previousTransactions);
      return { error };
    }
    return { success: true };
  };

  const updateTransaction = async (
    id: string,
    updates: {
      amount?: number;
      notes?: string;
      date?: string;
      customer_name?: string;
    }
  ) => {
    const previousTransactions = [...transactions];

    // Optimistic update
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              amount: updates.amount !== undefined ? updates.amount : t.amount,
              notes: updates.notes !== undefined ? updates.notes : t.notes,
              date: updates.date !== undefined ? updates.date : t.date,
              customerName:
                updates.customer_name !== undefined
                  ? updates.customer_name
                  : t.customerName,
            }
          : t
      )
    );

    const { error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id)
      .eq("user_id", session?.user?.id);

    if (error) {
      console.error("Error updating transaction:", error);
      setTransactions(previousTransactions); // Revert
      return { error };
    }
    return { success: true };
  };

  const deleteAllTransactions = async () => {
    const previousTransactions = [...transactions];
    setTransactions([]);

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("user_id", session?.user?.id)
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Hack to delete all rows matching user_id

    if (error) {
      console.error("Error deleting all transactions:", error);
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
    updateTransaction,
    deleteAllTransactions,
    setTransactions,
  };
};
