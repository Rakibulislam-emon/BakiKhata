"use client";

import { useTransactionsContext } from "@/context/TransactionsContext";
import { CustomerList } from "@/components/CustomerList";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, X, TrendingUp, ChevronLeft } from "lucide-react";
import { CustomerSummary, Transaction } from "@/types";
import { m, AnimatePresence } from "@/lib/framer";

export default function CustomersPage() {
  const { transactions, loading } = useTransactionsContext();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const customerSummaries = useMemo(() => {
    const customerMap = new Map<string, Transaction[]>();

    // Process all transactions to get accurate balances
    transactions.forEach((transaction) => {
      const name = transaction.customerName.toLowerCase().trim();
      if (!customerMap.has(name)) customerMap.set(name, []);
      customerMap.get(name)!.push(transaction);
    });

    const summaries: CustomerSummary[] = [];
    customerMap.forEach((txns, name) => {
      // Calculate net unpaid balance (sum of all unpaid transactions: +/-)
      const totalBaki = txns
        .filter((t) => !t.isPaid)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      // In the Receivables list, we show customers who have a positive balance (> 0)
      if (totalBaki > 0) {
        const sortedTxns = txns.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
        new Date(a.lastTransaction).getTime(),
    );
  }, [transactions]);

  const handleSelectCustomer = (name: string) => {
    // Navigate to dynamic route based on customer name (encoded)
    router.push(`/dashboard/receivables/${encodeURIComponent(name)}`);
  };

  if (loading && transactions.length === 0) {
    return <FullPageLoader />;
  }

  return (
    <div className="relative space-y-6 pb-32 pt-0">
      {/* Ambient background elements */}
      <div className="fixed  inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-6">
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 border border-white/20 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-visible group"
        >
          {/* Animated Background Decoration */}
          <div className="absolute  top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-emerald-500/20 transition-all duration-1000 pointer-events-none" />

          <div className="relative  z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <m.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => router.back()}
                  className="w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/5 shadow-sm hover:text-primary-500 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </m.button>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20 backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                  পাওনা তালিকা
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
                যাদের কাছে আপনি টাকা পাবেন তাদের তালিকা। বিস্তারিত দেখতে নামের
                উপর ক্লিক করুন।
              </p>
            </div>

            <div className="w-full md:w-auto min-w-[320px]">
              <div className="relative group/search mr-10">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within/search:text-primary-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="গ্রাহকের নাম খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl shadow-sm focus:bg-white dark:focus:bg-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300 placeholder:text-slate-400 font-bold text-slate-700 dark:text-slate-200"
                />
                <AnimatePresence>
                  {searchTerm && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                      <m.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearchTerm("")}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </m.button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </m.div>

        <CustomerList
          customerSummaries={customerSummaries}
          searchTerm={searchTerm}
          onSelectCustomer={handleSelectCustomer}
          baseHref="/dashboard/receivables"
        />
      </div>
    </div>
  );
}
