import React from "react";
import { TrendingDown, TrendingUp, History, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  totalBaki: number;
  totalPaid: number;
  transactionCount: number;
  customerCount: number;
}

export const SummaryCards = ({
  totalBaki,
  totalPaid,
  transactionCount,
  customerCount,
}: SummaryCardsProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 -mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-card card-hover">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">মোট বাকি</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(totalBaki)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-card card-hover">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">পরিশোধিত</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(totalPaid)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-card card-hover">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <History className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">মোট লেনদেন</p>
              <p className="text-xl font-bold text-orange-600">
                {transactionCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-card card-hover">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Check className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">গ্রাহক</p>
              <p className="text-xl font-bold text-blue-600">{customerCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
