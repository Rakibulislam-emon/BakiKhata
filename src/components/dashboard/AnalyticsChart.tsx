"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsData {
  date: string; // This is the label (e.g., "14:00" or "15 Feb")
  receivable: number;
  payable: number;
  paid: number;
}

interface AnalyticsChartProps {
  data: AnalyticsData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 p-4 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/5 space-y-3"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
        </div>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-8"
            >
              <span className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {entry.name === "receivable" ? "পাওনা" : "দেনা"}:
                </span>
              </span>
              <span
                className="text-xs font-black font-mono"
                style={{ color: entry.color }}
              >
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }
  return null;
};

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const [activeSeries, setActiveSeries] = useState({
    receivable: true,
    payable: true,
  });

  if (data.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold italic text-xs">
        তথ্য পাওয়া যায়নি
      </div>
    );
  }

  const toggleSeries = (series: "receivable" | "payable") => {
    setActiveSeries((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  const xInterval = data.length > 20 ? 3 : 0;

  return (
    <div className="w-full space-y-6">
      {/* Interactive Legend */}
      <div className="flex flex-wrap items-center gap-2 px-2">
        <button
          onClick={() => toggleSeries("receivable")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all duration-300 ${
            activeSeries.receivable
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "bg-slate-100 dark:bg-slate-800/50 border-transparent text-slate-500 dark:text-slate-400"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${activeSeries.receivable ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300 dark:bg-slate-600"}`}
          />
          <span className="text-[9px] font-black uppercase tracking-widest">
            পাওনা
          </span>
        </button>
        <button
          onClick={() => toggleSeries("payable")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all duration-300 ${
            activeSeries.payable
              ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 shadow-sm"
              : "bg-slate-100 dark:bg-slate-800/50 border-transparent text-slate-500 dark:text-slate-400"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${activeSeries.payable ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "bg-slate-300 dark:bg-slate-600"}`}
          />
          <span className="text-[9px] font-black uppercase tracking-widest">
            দেনা
          </span>
        </button>
      </div>

      <div className="w-full h-[300px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorReceivable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPayable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="1 6"
              vertical={false}
              stroke="currentColor"
              className="text-slate-300 dark:text-white/10"
              strokeWidth={2}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 9, fontWeight: 900 }}
              className="text-slate-400 uppercase tracking-tighter"
              dy={15}
              interval={xInterval}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
              }
              tick={{ fill: "currentColor", fontSize: 9, fontWeight: 900 }}
              className="text-slate-300 dark:text-white/5"
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "rgba(100, 116, 139, 0.2)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="receivable"
              name="receivable"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorReceivable)"
              animationDuration={1500}
              hide={!activeSeries.receivable}
              activeDot={{
                r: 6,
                stroke: "#10b981",
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="payable"
              name="payable"
              stroke="#f43f5e"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPayable)"
              animationDuration={1500}
              animationBegin={300}
              hide={!activeSeries.payable}
              activeDot={{
                r: 6,
                stroke: "#f43f5e",
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
