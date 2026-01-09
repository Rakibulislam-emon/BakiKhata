import React, { useState } from "react";
import { CustomerSummary } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Filter,
} from "lucide-react";

interface CustomerListProps {
  customerSummaries: CustomerSummary[];
  searchTerm: string;
  onSelectCustomer: (name: string) => void;
}

type FilterStatus = "all" | "unpaid" | "paid";

export const CustomerList = ({
  customerSummaries,
  searchTerm,
  onSelectCustomer,
}: CustomerListProps) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredCustomers = customerSummaries.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Calculate balance logic same as render
    const totalBaki = c.transactions
      .filter((t) => !t.isPaid)
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalBaki;
    const isPaidOff = balance === 0;

    if (filterStatus === "unpaid") return matchesSearch && !isPaidOff;
    if (filterStatus === "paid") return matchesSearch && isPaidOff;
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 mt-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ml-1">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-500" />
          <h3 className="text-xl font-bold text-secondary-900">
            গ্রাহকদের তালিকা
          </h3>
        </div>

        {/* Filter Buttons */}
        <div className="flex p-1 bg-secondary-100/50 backdrop-blur-sm rounded-xl border border-secondary-200/50 w-fit">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filterStatus === "all"
                ? "bg-white text-secondary-900 shadow-sm"
                : "text-secondary-500 hover:text-secondary-700"
            }`}
          >
            সব
          </button>
          <button
            onClick={() => setFilterStatus("unpaid")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
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
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              filterStatus === "paid"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-secondary-500 hover:text-primary-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                filterStatus === "paid" ? "bg-primary-500" : "bg-primary-400/50"
              }`}
            />
            পরিশোধিত
          </button>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="w-10 h-10 text-secondary-400" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-700 mb-2">
            কোনো গ্রাহক পাওয়া যায়নি
          </h3>
          <p className="text-secondary-500">
            {searchTerm
              ? "অন্য নাম দিয়ে অনুসন্ধান করুন"
              : filterStatus !== "all"
              ? "এই ফিল্টারে কোনো গ্রাহক নেই"
              : "নতুন বিল যোগ করলে এখানে গ্রাহকের তালিকা দেখা যাবে"}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredCustomers.map((customer, index) => {
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectCustomer(customer.name)}
                  className="glass-card p-5 glass-card-hover cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                          !isPaidOff
                            ? "bg-gradient-to-br from-orange-400 to-red-500"
                            : "bg-gradient-to-br from-emerald-400 to-primary-600"
                        }`}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                          {customer.name}
                        </h3>
                        <p className="text-xs text-secondary-500 flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary-300"></span>
                          শেষ লেনদেন: {formatDate(customer.lastTransaction)}
                        </p>
                        <div className="flex gap-3 text-xs text-secondary-500 mt-2 font-medium">
                          <span
                            className={`${
                              unpaidCount > 0
                                ? "text-red-500"
                                : "text-secondary-400"
                            }`}
                          >
                            বাকি: {unpaidCount}
                          </span>
                          <span className="text-secondary-300">|</span>
                          <span className="text-primary-600">
                            পরিশোধিত: {paidCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-6">
                      <div>
                        <p
                          className={`text-2xl font-bold font-mono tracking-tight ${
                            !isPaidOff ? "text-red-500" : "text-primary-600"
                          }`}
                        >
                          {formatCurrency(balance)}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {!isPaidOff ? (
                            <>
                              <AlertCircle className="w-3 h-3 text-red-500" />
                              <p className="text-xs font-semibold text-red-500">
                                বাকি আছে
                              </p>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-primary-500" />
                              <p className="text-xs font-semibold text-primary-500">
                                পরিশোধিত
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-secondary-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
