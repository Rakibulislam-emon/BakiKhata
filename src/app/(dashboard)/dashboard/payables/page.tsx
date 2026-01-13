"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { CustomerList } from "@/components/CustomerList";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingDown } from "lucide-react";
import { CustomerSummary } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function PayablesPage() {
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
      // Calculate balance
      const totalBaki = txns
        .filter((t) => !t.isPaid)
        .reduce((sum, t) => sum + t.amount, 0);

      // Only include if balance is NEGATIVE (Payable/Dena) OR settled but historically negative
      const hasNegativeHistory = txns.some((t) => t.amount < 0);

      if (totalBaki < 0 || (totalBaki === 0 && hasNegativeHistory)) {
        const sortedTxns = txns.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        summaries.push({
          name: txns[0].customerName, // Use original casing
          transactions: sortedTxns,
          lastTransaction: sortedTxns[0]?.date || "",
        });
      }
    });

    return summaries.sort(
      (a, b) =>
        new Date(b.lastTransaction).getTime() -
        new Date(a.lastTransaction).getTime()
    );
  }, [transactions]);

  const handleSelectCustomer = (name: string) => {
    router.push(`/dashboard/payables/${encodeURIComponent(name)}`);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-red-50 to-white border-l-4 border-l-red-500">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-secondary-900 tracking-tight mb-2 flex items-center gap-2">
              <TrendingDown className="w-8 h-8 text-red-500" />
              দেনা তালিকা
            </h1>
            <p className="text-secondary-500 max-w-lg leading-relaxed">
              যাদের কাছে আপনি ঋণী বা দেনা আছেন তাদের তালিকা। পরিশোধ করতে ক্লিক
              করুন।
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[300px]">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
              <input
                type="text"
                placeholder="নাম খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-4 rounded-xl border border-secondary-200 bg-white/50 backdrop-blur-sm shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-secondary-400 font-medium"
              />
              <AnimatePresence>
                {searchTerm && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchTerm("")}
                      className="p-1.5 rounded-full bg-secondary-100 text-secondary-500 hover:bg-secondary-200 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <CustomerList
        customerSummaries={customerSummaries}
        searchTerm={searchTerm}
        onSelectCustomer={handleSelectCustomer}
      />
    </div>
  );
}
