"use client";

import { useTransactionsContext } from "@/context/TransactionsContext";
import { BentoStats } from "@/components/dashboard/BentoStats";
import { RecentTransactions } from "@/components/RecentTransactions";
import { FullPageLoader } from "@/components/ui/LoadingSpinner";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Plus, BarChart3, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  format,
  subDays,
  isSameDay,
  startOfDay,
  eachHourOfInterval,
  endOfDay,
  isSameHour,
} from "date-fns";
import { bn } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";

// Dynamic import for performance
const AnalyticsChart = dynamic(
  () =>
    import("@/components/dashboard/AnalyticsChart").then(
      (mod) => mod.AnalyticsChart,
    ),
  {
    loading: () => (
      <div className="w-full h-[300px] flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-600 animate-bounce" />
          <span className="text-xs font-bold text-slate-300 dark:text-slate-600">
            চার্ট লোড হচ্ছে...
          </span>
        </div>
      </div>
    ),
    ssr: false,
  },
);

type Granularity = "day" | "week" | "month";

export default function DashboardPage() {
  const { session } = useAuth();
  const [granularity, setGranularity] = useState<Granularity>("week");

  const {
    transactions,
    loading,
    deleteTransaction,
    clearRecent,
    openAddModal,
  } = useTransactionsContext();

  // Process chart data based on granularity (always relative to 'today')
  const { chartData, periodStats } = useMemo(() => {
    let daySequence: {
      date: Date | string;
      label: string;
      receivable: number;
      payable: number;
      paid: number;
    }[] = [];
    let periodReceivable = 0;
    let periodPayable = 0;
    let periodPaid = 0;
    const today = new Date();

    if (granularity === "day") {
      const start = startOfDay(today);
      const end = endOfDay(today);
      daySequence = eachHourOfInterval({ start, end }).map((hour) => ({
        date: hour,
        label: format(hour, "HH:mm"),
        receivable: 0,
        payable: 0,
        paid: 0,
      }));

      transactions.forEach((t) => {
        const tDate = new Date(t.date);
        const hourData = daySequence.find(
          (d) =>
            typeof d.date !== "string" &&
            isSameHour(d.date, tDate) &&
            isSameDay(d.date, tDate),
        );
        if (hourData) {
          if (t.isPaid) {
            const amnt = Math.abs(t.amount);
            hourData.paid += amnt;
            periodPaid += amnt;
          } else if (t.amount > 0) {
            hourData.receivable += t.amount;
            periodReceivable += t.amount;
          } else {
            const amnt = Math.abs(t.amount);
            hourData.payable += amnt;
            periodPayable += amnt;
          }
        }
      });
    } else {
      const daysCount = granularity === "week" ? 7 : 30;
      daySequence = Array.from({ length: daysCount }).map((_, i) => {
        const date = subDays(today, daysCount - 1 - i);
        return {
          date: startOfDay(date),
          label: format(date, "d MMM", { locale: bn }),
          receivable: 0,
          payable: 0,
          paid: 0,
        };
      });

      transactions.forEach((t) => {
        const tDate = startOfDay(new Date(t.date));
        const dayData = daySequence.find(
          (d) => typeof d.date !== "string" && isSameDay(d.date, tDate),
        );
        if (dayData) {
          if (t.isPaid) {
            const amnt = Math.abs(t.amount);
            dayData.paid += amnt;
            periodPaid += amnt;
          } else if (t.amount > 0) {
            dayData.receivable += t.amount;
            periodReceivable += t.amount;
          } else {
            const amnt = Math.abs(t.amount);
            dayData.payable += amnt;
            periodPayable += amnt;
          }
        }
      });
    }

    return {
      chartData: daySequence.map(({ label, receivable, payable, paid }) => ({
        date: label,
        receivable,
        payable,
        paid,
      })),
      periodStats: {
        receivable: periodReceivable,
        payable: periodPayable,
        paid: periodPaid,
      },
    };
  }, [transactions, granularity]);

  const totalBaki = useMemo(
    () =>
      transactions
        .filter((t) => !t.isPaid && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const totalDena = useMemo(
    () =>
      transactions
        .filter((t) => !t.isPaid && t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const todayPaid = useMemo(() => {
    const today = startOfDay(new Date());
    return transactions
      .filter(
        (t) => t.isPaid && t.amount > 0 && isSameDay(new Date(t.date), today),
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const customerSummaries = useMemo(() => {
    const customerMap = new Map<string, any[]>();
    transactions.forEach((transaction) => {
      const name = transaction.customerName.toLowerCase().trim();
      if (!customerMap.has(name)) customerMap.set(name, []);
      customerMap.get(name)!.push(transaction);
    });
    return customerMap.size;
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return transactions
      .filter((t) => !t.isHiddenFromRecent)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const handleDeleteTransaction = (id: string) => {
    toast("আপনি কি নিশ্চিত যে এই লেনদেন মুছে ফেলতে চান?", {
      action: {
        label: "মুছুন",
        onClick: async () => {
          const res = await deleteTransaction(id);
          if (res.error) {
            toast.error("মুছতে সমস্যা হয়েছে");
          } else {
            toast.success("লেনদেন মুছে ফেলা হয়েছে");
          }
        },
      },
    });
  };

  const handleClearRecent = () => {
    toast("সাম্প্রতিক তালিকা পরিষ্কার করতে চান?", {
      description: "মূল হিসাব ঠিক থাকবে, শুধু তালিকা পরিষ্কার হবে।",
      action: {
        label: "পরিষ্কার করুন",
        onClick: async () => {
          const recentIds = recentTransactions.map((t) => t.id);
          const res = await clearRecent(recentIds);
          if (res.error) {
            toast.error("সমস্যা হয়েছে");
          } else {
            toast.success("সাম্প্রতিক তালিকা পরিষ্কার করা হয়েছে");
          }
        },
      },
    });
  };

  if (loading && transactions.length === 0) {
    return <FullPageLoader />;
  }

  // Get user's first name
  const userName = session?.user?.user_metadata?.name || "User";
  const firstName = userName.split(" ")[0];

  return (
    <div className="relative space-y-8 pb-32 pt-4">
      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              শুভ সকাল,{" "}
              <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
                {firstName}
              </span>{" "}
              👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
              আজকের হিসাব নিকাশ শুরু করুন
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddModal}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/20"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus className="w-5 h-5" />
            <span>নতুন লেনদেন</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <BentoStats
            totalBaki={totalBaki}
            totalDena={totalDena}
            totalPaid={todayPaid}
            transactionCount={transactions.length}
            customerCount={customerSummaries}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2">
            <RecentTransactions
              transactions={recentTransactions}
              onClearRecent={handleClearRecent}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/20 dark:border-white/5 h-full flex flex-col gap-8 group overflow-hidden">
              <div className="flex flex-col gap-6">
                {/* Simplified Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase text-nowrap">
                        ট্রেন্ড বিশ্লেষণ
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400">
                        অ্যানালিটিক্স
                      </p>
                    </div>
                  </div>

                  <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                    {(["day", "week", "month"] as Granularity[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGranularity(g)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                          granularity === g
                            ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        }`}
                      >
                        {g === "day" ? "দিন" : g === "week" ? "সপ্তাহ" : "মাস"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simplified 3-Metric View */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-white dark:bg-slate-800/60 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden">
                  <div className="space-y-1 relative z-10">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                      মোট পাওনা
                    </p>
                    <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(periodStats.receivable)}
                    </p>
                  </div>
                  <div className="space-y-1 relative z-10">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                      মোট দেনা
                    </p>
                    <p className="text-[11px] font-black text-rose-600 dark:text-rose-400 font-mono">
                      {formatCurrency(periodStats.payable)}
                    </p>
                  </div>
                  <div className="space-y-1 relative z-10 border-l border-slate-100 dark:border-white/5 pl-3">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400">
                      মোট আদায়
                    </p>
                    <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {formatCurrency(periodStats.paid)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
                <AnalyticsChart data={chartData} />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-2">
                <TrendingUp className="w-3 h-3 text-emerald-500 animate-pulse" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center opacity-70">
                  {granularity === "day"
                    ? "আজকের রিয়েল-টাইম ট্রেন্ড"
                    : `গত ${granularity === "week" ? "৭" : "৩০"} দিনের লেনদেন`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
