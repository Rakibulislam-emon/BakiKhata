"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { CustomerList } from "@/components/CustomerList";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { CustomerSummary } from "@/types";
import { motion } from "framer-motion";

export default function CustomersPage() {
  const { session } = useAuth();
  const { transactions, fetchTransactions, setTransactions } =
    useTransactions(session);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [session, fetchTransactions, setTransactions]);

  const customerSummaries = useMemo(() => {
    const customerMap = new Map<string, any[]>();
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

  const handleSelectCustomer = (name: string) => {
    // Navigate to dynamic route based on customer name (encoded)
    router.push(`/customers/${encodeURIComponent(name)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            গ্রাহক তালিকা
          </h1>
          <p className="text-secondary-500">
            আপনার সকল গ্রাহকের হিসাব এখানে দেখুন
          </p>
        </div>

        {/* Placeholder for Add Customer Action if needed explicitly, 
            though usually flows start from creating a transaction */}
      </div>

      <div className="relative group max-w-lg">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
        <input
          type="text"
          placeholder="নাম অনুসন্ধান..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-secondary-200 bg-white shadow-soft focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-secondary-400"
        />
      </div>

      <CustomerList
        customerSummaries={customerSummaries}
        searchTerm={searchTerm}
        onSelectCustomer={handleSelectCustomer}
      />
    </div>
  );
}
