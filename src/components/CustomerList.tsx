import React from "react";
import { CustomerSummary } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";

interface CustomerListProps {
  customerSummaries: CustomerSummary[];
  searchTerm: string;
  onSelectCustomer: (name: string) => void;
}

export const CustomerList = ({
  customerSummaries,
  searchTerm,
  onSelectCustomer,
}: CustomerListProps) => {
  const filteredCustomers = customerSummaries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        📊 গ্রাহকের বাকির হিসাব
      </h3>

      {customerSummaries.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-card">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            কোনো গ্রাহক নেই
          </h3>
          <p className="text-gray-500">
            উপরের বাটনে ক্লিক করে নতুন বিল যোগ করুন
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => {
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

            return (
              <div
                key={customer.name}
                onClick={() => onSelectCustomer(customer.name)}
                className="bg-white rounded-xl p-4 shadow-card card-hover cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        balance > 0 ? "bg-orange-500" : "bg-green-500"
                      }`}
                    >
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        শেষ লেনদেন: {formatDate(customer.lastTransaction)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        মোট বিল: {customer.transactions.length}টি | বাকি:{" "}
                        {unpaidCount}টি | পরিশোধিত: {paidCount}টি
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${
                        balance > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {formatCurrency(balance)}
                    </p>
                    <p
                      className={`text-sm ${
                        balance > 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {balance > 0 ? "বাকি" : "সব পরিশোধিত"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
