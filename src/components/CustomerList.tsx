import React, { useState, useRef, useEffect } from "react";
import { CustomerSummary } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Clock,
  TrendingDown,
  SortAsc,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      // Calculate balance logic same as render
      const totalBaki = c.transactions
        .filter((t) => !t.isPaid)
        .reduce((sum, t) => sum + t.amount, 0);
      const balance = totalBaki;
      const isPaidOff = balance === 0;

      // Filtering logic: Name OR Amount Search
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
      if (sortBy === "name_asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "highest_balance") {
        const balanceA = a.transactions
          .filter((t) => !t.isPaid)
          .reduce((sum, t) => sum + t.amount, 0);
        const balanceB = b.transactions
          .filter((t) => !t.isPaid)
          .reduce((sum, t) => sum + t.amount, 0);
        return Math.abs(balanceB) - Math.abs(balanceA);
      }
      // Default: recent
      // Use the LATEST transaction date available (which might be the filtered date)
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

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case "recent":
        return <Clock className="w-4 h-4" />;
      case "highest_balance":
        return <TrendingDown className="w-4 h-4" />;
      case "name_asc":
        return <SortAsc className="w-4 h-4" />;
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
    <div className="w-full px-4 mt-8 pb-12">
      <div className="flex flex-col gap-6 mb-6">
        {/* Header Section (Unchanged) */}
        <div className="flex items-center gap-2 ml-1">
          <Users className="w-5 h-5 text-primary-500" />
          <h3 className="text-xl font-bold text-secondary-900">তালিকাসমূহ</h3>
          <span className="text-sm font-medium text-secondary-500 bg-secondary-100 px-2 py-0.5 rounded-full">
            {filteredAndSortedCustomers.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Filter Buttons */}
          <div className="flex p-1 bg-secondary-100/50 backdrop-blur-sm rounded-xl border border-secondary-200/50 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterStatus === "all"
                  ? "bg-white text-secondary-900 shadow-sm"
                  : "text-secondary-500 hover:text-secondary-700"
              }`}
            >
              সব
            </button>
            <button
              onClick={() => setFilterStatus("unpaid")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterStatus === "unpaid"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-secondary-500 hover:text-red-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  filterStatus === "unpaid" ? "bg-red-500" : "bg-red-400/50"
                }`}
              />
              বাকি আছে
            </button>
            <button
              onClick={() => setFilterStatus("paid")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterStatus === "paid"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-secondary-500 hover:text-primary-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  filterStatus === "paid"
                    ? "bg-primary-500"
                    : "bg-primary-400/50"
                }`}
              />
              পরিশোধিত
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Custom Sort Dropdown */}
            <div className="relative w-full sm:w-auto z-20" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white backdrop-blur-md border border-secondary-200 rounded-xl flex items-center justify-between gap-4 text-sm font-medium text-secondary-700 hover:border-primary-500 hover:text-primary-600 transition-all shadow-soft group"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 transition-colors" />
                  <span>{getSortLabel(sortBy)}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-secondary-400 transition-transform duration-300 ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-full sm:w-56 bg-white rounded-xl shadow-xl border border-secondary-100 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-1.5">
                      {(
                        [
                          "recent",
                          "highest_balance",
                          "name_asc",
                        ] as SortOption[]
                      ).map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setIsSortOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            sortBy === option
                              ? "bg-primary-50 text-primary-700"
                              : "text-secondary-600 hover:bg-secondary-50"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-md ${
                              sortBy === option
                                ? "bg-white text-primary-600 shadow-sm"
                                : "bg-secondary-100 text-secondary-500"
                            }`}
                          >
                            {getSortIcon(option)}
                          </div>
                          {getSortLabel(option)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {filteredAndSortedCustomers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="w-10 h-10 text-secondary-400" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-700 mb-2">
            কিছু পাওয়া যায়নি
          </h3>
          <p className="text-secondary-500">
            {searchTerm
              ? "অন্য নাম দিয়ে অনুসন্ধান করুন"
              : filterStatus !== "all"
              ? "এই ফিল্টারে কেউ নেই"
              : "নতুন লেনদেন যোগ করলে এখানে তালিকা দেখা যাবে"}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {paginatedCustomers.map((customer, index) => {
              const totalBaki = customer.transactions
                .filter((t) => !t.isPaid)
                .reduce((sum, t) => sum + t.amount, 0);

              const unpaidCount = customer.transactions.filter(
                (t) => !t.isPaid
              ).length;
              const paidCount = customer.transactions.filter(
                (t) => t.isPaid
              ).length;

              const balance = totalBaki;
              const isPaidOff = balance === 0;

              return (
                <motion.div
                  layout
                  key={customer.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectCustomer(customer.name)}
                  className={`glass-card p-4 hover:shadow-md transition-all cursor-pointer group active:scale-[0.99] border-l-4 ${
                    !isPaidOff
                      ? balance > 0
                        ? "border-l-emerald-500 hover:bg-emerald-50/30"
                        : "border-l-red-500 hover:bg-red-50/30"
                      : "border-l-emerald-500 hover:bg-emerald-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ring-4 ring-white/50 ${
                          !isPaidOff
                            ? balance > 0
                              ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                              : "bg-gradient-to-br from-red-500 to-red-600"
                            : "bg-gradient-to-br from-emerald-400 to-emerald-600"
                        }`}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-secondary-900 truncate group-hover:text-primary-600 transition-colors">
                          {customer.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-[10px] sm:text-xs font-medium text-secondary-400 flex items-center gap-1 bg-secondary-50 px-2 py-0.5 rounded-full border border-secondary-100">
                            <Clock className="w-3 h-3" />
                            {formatDate(customer.lastTransaction)}
                          </span>

                          {(unpaidCount > 0 || paidCount > 0) && (
                            <div className="hidden sm:flex items-center gap-2">
                              {unpaidCount > 0 && (
                                <span className="text-[10px] font-medium text-secondary-500 bg-secondary-100 px-1.5 py-0.5 rounded-full">
                                  সক্রিয়: {unpaidCount}
                                </span>
                              )}
                              {paidCount > 0 && (
                                <span className="text-[10px] font-medium text-secondary-400 bg-secondary-50 px-1.5 py-0.5 rounded-full">
                                  পরিশোধিত: {paidCount}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Action */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className={`text-lg sm:text-xl font-bold font-mono tracking-tight ${
                            !isPaidOff
                              ? balance > 0
                                ? "text-emerald-600"
                                : "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {formatCurrency(Math.abs(balance))}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          {!isPaidOff ? (
                            balance > 0 ? (
                              <>
                                <TrendingDown className="w-3 h-3 text-emerald-500 rotate-180" />
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                  পাওনা
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                                  দেনা
                                </span>
                              </>
                            )
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                পরিশোধিত
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                        <ChevronRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-secondary-200/50">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium text-secondary-600 hover:bg-white hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← আগের
              </button>
              <span className="text-sm font-medium text-secondary-500 bg-white px-4 py-2 rounded-xl border border-secondary-100 shadow-sm">
                পৃষ্ঠা {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-medium text-secondary-600 hover:bg-white hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                পরের →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
