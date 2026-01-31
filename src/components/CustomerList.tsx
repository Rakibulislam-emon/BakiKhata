import React, { useState, useRef, useEffect } from "react";
import { CustomerSummary } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils"; // Using formatDateTime for consistency
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Users,
  Search,
  X,
  Plus,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

interface CustomerListProps {
  customerSummaries: CustomerSummary[];
  searchTerm: string;
  onSelectCustomer: (name: string) => void;
}

type FilterStatus = "all" | "unpaid" | "paid";
type SortOption = "recent" | "highest_balance" | "lowest_balance";

export const CustomerList = ({
  customerSummaries,
  searchTerm,
  onSelectCustomer,
}: CustomerListProps) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAndSortedCustomers = customerSummaries
    .filter((c) => {
      const totalBaki = c.transactions
        .filter((t) => !t.isPaid)
        .reduce((sum, t) => sum + t.amount, 0);
      const balance = totalBaki;
      const isPaidOff = balance === 0;

      const lowerTerm = searchTerm.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(lowerTerm) ||
        Math.abs(balance).toString().includes(lowerTerm);

      let matchesFilter = true;
      if (filterStatus === "unpaid") matchesFilter = !isPaidOff;
      if (filterStatus === "paid") matchesFilter = isPaidOff;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "highest_balance") {
        const balanceA = a.transactions
          .filter((t) => !t.isPaid)
          .reduce((sum, t) => sum + t.amount, 0);
        const balanceB = b.transactions
          .filter((t) => !t.isPaid)
          .reduce((sum, t) => sum + t.amount, 0);
        return Math.abs(balanceB) - Math.abs(balanceA);
      }
      if (sortBy === "lowest_balance") {
        const balanceA = a.transactions
          .filter((t) => !t.isPaid)
          .reduce((sum, t) => sum + t.amount, 0);
        const balanceB = b.transactions
          .filter((t) => !t.isPaid)
          .reduce((sum, t) => sum + t.amount, 0);
        return Math.abs(balanceA) - Math.abs(balanceB);
      }
      // Default: recent (latest transaction date)
      const lastA = a.transactions[0]?.date || a.lastTransaction;
      const lastB = b.transactions[0]?.date || b.lastTransaction;
      return new Date(lastB).getTime() - new Date(lastA).getTime();
    });

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "recent":
        return "সম্প্রতি সক্রিয়";
      case "highest_balance":
        return "সর্বোচ্চ পরিমাণ";
      case "lowest_balance":
        return "সর্বনিম্ন পরিমাণ";
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / ITEMS_PER_PAGE,
  );
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="w-full mt-6 pb-24">
      <div className="flex flex-col gap-6 mb-8 relative z-30">
        {/* Header & Controls */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 ring-1 ring-slate-200/50 dark:ring-white/5">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
              গ্রাহক তালিকা ({filteredAndSortedCustomers.length})
            </span>
          </div>

          {/* Sort Dropdown - Minimal SaaS Style */}
          <div className="relative" ref={sortRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 px-4 py-2.5 rounded-2xl shadow-sm hover:border-primary-500/50 transition-all duration-300"
            >
              <ArrowIcon />
              <span>{getSortLabel(sortBy)}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute right-0 top-full mt-3 w-52 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden z-50 p-1.5"
                >
                  {(
                    [
                      "recent",
                      "highest_balance",
                      "lowest_balance",
                    ] as SortOption[]
                  ).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                        sortBy === option
                          ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {getSortLabel(option)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-3 px-1 overflow-x-auto pb-4 scrollbar-hide">
          <FilterPill
            active={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
            label="সব"
          />
          <FilterPill
            active={filterStatus === "unpaid"}
            onClick={() => setFilterStatus("unpaid")}
            label="বাকি আছে"
            dotColor="bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
          />
          <FilterPill
            active={filterStatus === "paid"}
            onClick={() => setFilterStatus("paid")}
            label="পরিশোধিত"
            dotColor="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          />
        </div>
      </div>

      <div className="space-y-4 px-1 relative z-10">
        <AnimatePresence mode="popLayout">
          {paginatedCustomers.map((customer, index) => {
            const totalBaki = customer.transactions
              .filter((t) => !t.isPaid)
              .reduce((sum, t) => sum + Number(t.amount || 0), 0);

            const balance = totalBaki;
            const isPaidOff = Math.abs(balance) < 0.01;

            // SaaS Color Palette
            const statusColor = isPaidOff
              ? "text-emerald-600 dark:text-emerald-400"
              : balance > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400";

            const statusBg = isPaidOff
              ? "bg-emerald-50 dark:bg-emerald-500/10"
              : balance > 0
                ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20"
                : "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20";

            const barColor = isPaidOff
              ? "bg-emerald-400"
              : balance > 0
                ? "bg-emerald-500"
                : "bg-rose-500";

            return (
              <motion.div
                layout
                key={customer.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                onClick={() => onSelectCustomer(customer.name)}
                className="group relative bg-white/95 dark:bg-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-none border border-slate-200/60 dark:border-white/5 cursor-pointer overflow-visible transition-all duration-500"
              >
                {/* Curved Indicator Bar */}
                <div
                  className={`absolute left-0 top-8 bottom-8 w-1.5 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${barColor}`}
                />

                <div className="flex items-center gap-6">
                  {/* Modern Avatar (Alphabet) */}
                  <div
                    className={`w-12 h-12 rounded-2xl ${statusBg} flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <span className={`text-lg font-black ${statusColor}`}>
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top Row: Name */}
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 truncate tracking-tighter leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {customer.name}
                      </h3>
                    </div>

                    {/* Date Box */}
                    <div className="mt-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDateTime(
                          customer.lastTransaction || new Date().toISOString(),
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Amount and Status */}
                    <div className="mt-5 flex items-center gap-4">
                      <div
                        className={`text-3xl font-black font-mono tracking-tighter tabular-nums ${statusColor} leading-none`}
                      >
                        {formatCurrency(Math.abs(balance))}
                      </div>
                      <div className="shrink-0">
                        {isPaidOff ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/50 dark:bg-emerald-900/30 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            পরিশোধিত
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${balance > 0 ? "bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20" : "bg-rose-100/50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 ring-rose-500/20"} text-[10px] font-black uppercase tracking-widest ring-1`}
                          >
                            {balance > 0 ? (
                              <>
                                <TrendingUp className="w-3.5 h-3.5" />
                                পাওনা
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-3.5 h-3.5" />
                                দেনা
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Arrow (Centered with Avatar) */}
                  <div className="h-10 w-10 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-xl group-hover:shadow-primary-500/30 group-hover:scale-110 group-active:scale-95 transition-all duration-500 shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {filteredAndSortedCustomers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Users className="w-10 h-10" />
            </div>
            <p className="text-slate-400 font-bold">কোনো গ্রাহক পাওয়া যায়নি</p>
          </motion.div>
        )}
      </div>

      {/* Pagination (Simplified SaaS Style) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-12 pt-8 border-t border-slate-100 dark:border-white/5 relative z-10">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 disabled:opacity-30 transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-white/5"
          >
            পূর্ববর্তী
          </motion.button>
          <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-4 py-1.5 rounded-full border border-slate-100 dark:border-white/5">
            {currentPage} <span className="opacity-30 mx-1">/</span>{" "}
            {totalPages}
          </span>
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 disabled:opacity-30 transition-all duration-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-white/5"
          >
            পরবর্তী
          </motion.button>
        </div>
      )}
    </div>
  );
};

// Helper Components
const FilterPill = ({ active, onClick, label, dotColor }: any) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-[1.25rem] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
      active
        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none"
        : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5 hover:border-primary-500/50"
    }`}
  >
    {dotColor && <div className={`w-2 h-2 rounded-full ${dotColor}`} />}
    {label}
  </motion.button>
);

const ArrowIcon = () => (
  <svg
    className="w-4 h-4 text-slate-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
    />
  </svg>
);
