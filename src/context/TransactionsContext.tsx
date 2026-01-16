"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { Transaction } from "@/types";
import { TransactionForm } from "@/components/TransactionForm";
import { toast } from "sonner";

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (data: any) => Promise<any>;
  deleteTransaction: (id: string) => Promise<any>;
  updateTransaction: (id: string, updates: any) => Promise<any>;
  togglePaid: (id: string) => Promise<any>;
  clearRecent: (ids: string[]) => Promise<any>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  deleteAllForCustomer: (customerName: string) => Promise<any>;
  toggleAllPaidForCustomer: (
    customerName: string,
    shouldBePaid: boolean
  ) => Promise<any>;
  deleteAllPaidForCustomer: (customerName: string) => Promise<any>;
  deleteAllTransactions: () => Promise<any>;
  openAddModal: () => void;
  closeAddModal: () => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const transactionHook = useTransactions(session);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    notes: "",
    type: "lend" as "lend" | "borrow",
  });

  useEffect(() => {
    if (session) {
      transactionHook.fetchTransactions();
    }
  }, [session]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      toast.error("অনুগ্রহ করে নাম এবং টাকার পরিমাণ দিন");
      return;
    }

    const res = await transactionHook.addTransaction({
      customerName: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      notes: formData.notes,
    });

    if (res.error) {
      const errorMessage =
        typeof res.error === "string" ? res.error : "Failed to add transaction";
      toast.error(errorMessage);
    } else {
      toast.success("লেনদেন সফলভাবে যোগ করা হয়েছে");
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        amount: "",
        notes: "",
        type: "lend",
      });
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        ...transactionHook,
        openAddModal: () => setIsAddModalOpen(true),
        closeAddModal: () => setIsAddModalOpen(false),
      }}
    >
      {children}
      <TransactionForm
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddTransaction}
      />
    </TransactionsContext.Provider>
  );
}

export function useTransactionsContext() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      "useTransactionsContext must be used within a TransactionsProvider"
    );
  }
  return context;
}
