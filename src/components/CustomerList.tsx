import React, { useState, useRef, useEffect } from "react";
import { CustomerSummary } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils"; // Using formatDateTime for consistency
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ChevronRight,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";

interface CustomerListProps {
  customerSummaries: CustomerSummary[];
  searchTerm: string;
  onSelectCustomer: (name: string) => void;
}

type FilterStatus = "all" | "unpaid" | "paid";
type SortOption = "recent" | "highest_balance" | "name_asc";

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
        balance.toString().includes(lowerTerm);

      let matchesFilter = true;
      if (filterStatus === "unpaid") matchesFilter = !isPaidOff;
      if (filterStatus === "paid") matchesFilter = isPaidOff;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "highest_balance") {
        const balanceA = a.transactions
          .filter((t) => !t.isPaid)
          .reduce((sum, t) => sum + t.amount, 0);
        const balanceB = b.transactions
          .filter((t) => !t.isPaid)
          .reduce((sum, t) => sum + t.amount, 0);
        return Math.abs(balanceB) - Math.abs(balanceA);
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
      case "name_asc":
        return "নাম (A-Z)";
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / ITEMS_PER_PAGE
  );
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full mt-6 pb-24">
      <div className="flex flex-col gap-4 mb-6">
        {/* Header & Controls */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              গ্রাহক তালিকা ({filteredAndSortedCustomers.length})
            </span>
          </div>

          {/* Sort Dropdown - Minimal SaaS Style */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:border-slate-300 transition-all"
            >
              <ArrowIcon />
              <span>{getSortLabel(sortBy)}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 p-1"
                >
                  {(
                    ["recent", "highest_balance", "name_asc"] as SortOption[]
                  ).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        sortBy === option
                          ? "bg-slate-50 text-indigo-600 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
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
        <div className="flex gap-2 px-1 overflow-x-auto pb-2 scrollbar-hide">
          <FilterPill
            active={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
            label="সব"
          />
          <FilterPill
            active={filterStatus === "unpaid"}
            onClick={() => setFilterStatus("unpaid")}
            label="বাকি আছে"
            dotColor="bg-rose-500"
          />
          <FilterPill
            active={filterStatus === "paid"}
            onClick={() => setFilterStatus("paid")}
            label="পরিশোধিত"
            dotColor="bg-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-3 px-1">
        <AnimatePresence mode="popLayout">
          {paginatedCustomers.map((customer, index) => {
            const totalBaki = customer.transactions
              .filter((t) => !t.isPaid)
              .reduce((sum, t) => sum + t.amount, 0);

            const balance = totalBaki;
            const isPaidOff = balance === 0;

            // SaaS Color Palette
            const statusColor = isPaidOff
              ? "text-emerald-600"
              : balance > 0
              ? "text-emerald-600"
              : "text-rose-600";

            const statusBg = isPaidOff
              ? "bg-emerald-50"
              : balance > 0
              ? "bg-emerald-50 border-emerald-100"
              : "bg-rose-50 border-rose-100";

            const barColor = isPaidOff
              ? "bg-emerald-400"
              : balance > 0
              ? "bg-emerald-500"
              : "bg-rose-500";

            return (
              <motion.div
                layout
                key={customer.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                onClick={() => onSelectCustomer(customer.name)}
                className="group relative bg-white rounded-[1.25rem] p-4 shadow-sm hover:shadow-md border border-slate-200/60 cursor-pointer overflow-hidden transition-all"
              >
                {/* Curved Indicator Bar */}
                <div
                  className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${barColor}`}
                />

                <div className="flex items-center justify-between pl-3">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Modern Avatar */}
                    <div
                      className={`w-12 h-12 rounded-2xl ${statusBg} flex items-center justify-center border border-white shadow-sm shrink-0`}
                    >
                      <span className={`text-lg font-bold ${statusColor}`}>
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-800 truncate leading-tight group-hover:text-indigo-600 transition-colors">
                        {customer.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-500">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(
                            customer.lastTransaction || new Date().toISOString()
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-2 shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-base font-bold font-mono tracking-tight tabular-nums ${statusColor}`}
                      >
                        {formatCurrency(Math.abs(balance))}
                      </div>
                      <div
                        className={`flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-90 ${statusColor}`}
                      >
                        {isPaidOff ? (
                          <>পরিশোধিত</>
                        ) : (
                          <>{balance > 0 ? "পাওনা" : "দেনা"}</>
                        )}
                      </div>
                    </div>

                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {filteredAndSortedCustomers.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <p>কোনো গ্রাহক পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* Pagination (Simplified SaaS Style) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
          >
            পূর্ববর্তী
          </button>
          <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
          >
            পরবর্তী
          </button>
        </div>
      )}
    </div>
  );
};

// Helper Components
const FilterPill = ({ active, onClick, label, dotColor }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
      active
        ? "bg-slate-800 text-white shadow-md shadow-slate-200"
        : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
    }`}
  >
    {dotColor && <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
    {label}
  </button>
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
