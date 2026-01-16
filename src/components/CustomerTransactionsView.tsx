"use client";

import { useTransactionsContext } from "@/context/TransactionsContext";
import { CustomerDetail } from "@/components/CustomerDetail";
import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

interface CustomerTransactionsViewProps {
  backPath: string; // Dynamic back navigation
}

export const CustomerTransactionsView = ({
  backPath,
}: CustomerTransactionsViewProps) => {
  const params = useParams();
  const router = useRouter();

  // Decode the customer name from the URL
  const customerName = decodeURIComponent(params.id as string);

  const {
    transactions,
    addTransaction,
    togglePaid,
    deleteTransaction,
    updateTransaction,
    deleteAllForCustomer,
    toggleAllPaidForCustomer,
    deleteAllPaidForCustomer,
  } = useTransactionsContext();

  const [formData, setFormData] = useState<{
    name: string;
    amount: string;
    notes: string;
    type: "lend" | "borrow";
  }>({
    name: customerName,
    amount: "",
    notes: "",
    type: "lend",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Derived Data
  const selectedCustomerData = useMemo(() => {
    const txns = transactions.filter(
      (t) => t.customerName.toLowerCase() === customerName.toLowerCase()
    );

    return {
      name: txns[0]?.customerName || customerName,
      transactions: txns.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    };
  }, [customerName, transactions]);

  const customerTotals = useMemo(() => {
    const unpaid = selectedCustomerData.transactions.filter((t) => !t.isPaid);
    const paid = selectedCustomerData.transactions.filter((t) => t.isPaid);
    return {
      totalBaki: unpaid.reduce((sum, t) => sum + t.amount, 0),
      totalPaid: paid.reduce((sum, t) => sum + t.amount, 0),
      unpaidCount: unpaid.length,
      paidCount: paid.length,
    };
  }, [selectedCustomerData]);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount) {
      toast.error("দয়া করে টাকার পরিমাণ লিখুন");
      return;
    }

    const amountValue = parseFloat(formData.amount);

    // Pass raw positive amount - addTransaction will handle the sign based on type
    const res = await addTransaction({
      customerName,
      amount: amountValue,
      type: formData.type,
      notes: formData.notes,
    });

    if (res.error) {
      toast.error("বিল যোগ করতে সমস্যা হয়েছে");
    } else {
      setFormData((prev) => ({ ...prev, amount: "", notes: "" }));
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
    toast(`আপনি কি নিশ্চিত যে ${customerName}-এর সব লেনদেন মুছে ফেলতে চান?`, {
      action: {
        label: "সব মুছুন",
        onClick: async () => {
          const res = await deleteAllForCustomer(customerName);
          if (res.error) {
            toast.error("মুছতে সমস্যা হয়েছে");
          } else {
            toast.success("সব লেনদেন মুছে ফেলা হয়েছে");
            router.push(backPath); // Use dynamic back path
          }
        },
      },
      cancel: { label: "বাতিল", onClick: () => {} },
    });
  };

  const handleDeleteAllPaid = () => {
    toast(
      `আপনি কি নিশ্চিত যে ${customerName}-এর সব নিষ্পন্ন লেনদেন মুছে ফেলতে চান?`,
      {
        action: {
          label: "মুছুন",
          onClick: async () => {
            const res = await deleteAllPaidForCustomer(customerName);
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

  const handleToggleAllPaid = async () => {
    const customerData = selectedCustomerData;
    const allUnpaid = customerData.transactions.filter((t) => !t.isPaid);
    const shouldBePaid = allUnpaid.length > 0;

    const res = await toggleAllPaidForCustomer(customerName, shouldBePaid);
    if (res.error) {
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const handleUpdateTransaction = async (
    id: string,
    updates: { amount?: number; notes?: string; type?: "lend" | "borrow" }
  ) => {
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
      const existingTx = transactions.find((t) => t.id === id);
      if (existingTx && existingTx.amount > 0) finalAmount = -existingTx.amount;
    } else if (updates.type === "lend" && finalAmount === undefined) {
      const existingTx = transactions.find((t) => t.id === id);
      if (existingTx && existingTx.amount < 0)
        finalAmount = Math.abs(existingTx.amount);
    }

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

  return (
    <CustomerDetail
      customer={selectedCustomerData}
      totals={customerTotals}
      onBack={() => router.push(backPath)} // Use dynamic back path
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
  );
};
