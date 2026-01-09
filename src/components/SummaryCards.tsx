import React from "react";
import { TrendingDown, TrendingUp, History, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

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
  const cards = [
    {
      label: "মোট বাকি",
      value: formatCurrency(totalBaki),
      icon: TrendingDown,
      color: "red",
      bgClass: "bg-red-50 text-red-600",
      borderClass: "border-red-100",
    },
    {
      label: "পরিশোধিত",
      value: formatCurrency(totalPaid),
      icon: TrendingUp,
      color: "green",
      bgClass: "bg-green-50 text-green-600",
      borderClass: "border-green-100",
    },
    {
      label: "মোট লেনদেন",
      value: transactionCount,
      icon: History,
      color: "orange",
      bgClass: "bg-orange-50 text-orange-600",
      borderClass: "border-orange-100",
      isNumber: true,
    },
    {
      label: "মোট গ্রাহক",
      value: customerCount,
      icon: Users,
      color: "blue",
      bgClass: "bg-blue-50 text-blue-600",
      borderClass: "border-blue-100",
      isNumber: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="glass-card p-5 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex flex-col gap-3">
              <div className={`p-3 rounded-xl w-fit ${card.bgClass} shadow-sm`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-secondary-500 text-sm font-medium mb-1">
                  {card.label}
                </p>
                <p
                  className={`text-xl font-bold ${
                    card.isNumber ? "font-mono" : ""
                  } text-secondary-900`}
                >
                  {card.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
