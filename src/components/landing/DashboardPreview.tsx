import {
  BarChart3,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Bell,
  Menu,
} from "lucide-react";

export const DashboardPreview = () => {
  return (
    <div className="w-full h-full bg-slate-50 flex overflow-hidden font-sans select-none pointer-events-none">
      {/* Mock Sidebar */}
      <div className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 p-4 gap-6">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold shadow-sm">
            ব
          </div>
          <span className="font-bold text-slate-800">বাকি খাতা</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-bold shadow-sm">
            <BarChart3 className="w-4 h-4" />
            ড্যাশবোর্ড
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-600 rounded-lg text-sm font-semibold">
            <Users className="w-4 h-4" />
            হিসাবের তালিকা
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-600 rounded-lg text-sm font-semibold">
            <Wallet className="w-4 h-4" />
            লেনদেন সমূহ
          </div>
        </div>
      </div>

      {/* Mock Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mock Header */}
        <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm">
          <div className="text-slate-800 font-bold">ড্যাশবোর্ড</div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Search className="w-4 h-4 text-slate-500" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-400 to-indigo-400 border border-white shadow-md" />
          </div>
        </div>

        {/* Mock Content Body */}
        <div className="flex-1 p-6 overflow-hidden">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 text-[10px] md:text-xs font-black uppercase tracking-wider">
                <ArrowUpRight className="w-3 h-3" />
                মোট পাবো (Credit)
              </div>
              <div className="text-xl md:text-2xl font-black text-slate-900">
                ৳ ৫৪,৫০০
              </div>
              <div className="text-[10px] md:text-xs text-slate-500 font-bold flex items-center gap-1">
                ৫ জন ঋণী
              </div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-600 text-[10px] md:text-xs font-black uppercase tracking-wider">
                <ArrowDownLeft className="w-3 h-3" />
                মোট দেব (Debit)
              </div>
              <div className="text-xl md:text-2xl font-black text-slate-900">
                ৳ ১২,২০০
              </div>
              <div className="text-[10px] md:text-xs text-slate-500 font-bold flex items-center gap-1">
                ৩ জনের কাছে ঋণী
              </div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-slate-200 space-y-2 hidden md:block">
              <div className="flex items-center gap-2 text-indigo-600 text-[10px] md:text-xs font-black uppercase tracking-wider">
                <Wallet className="w-3 h-3" />
                নিট ব্যালেন্স
              </div>
              <div className="text-xl md:text-2xl font-black text-primary-600">
                ৳ ৪২,৩০০
              </div>
              <div className="text-[10px] md:text-xs text-slate-500 font-bold">
                বর্তমান অবস্থা
              </div>
            </div>
          </div>

          {/* Recent List Mock */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="text-sm font-black text-slate-800 uppercase tracking-tight">
                সাম্প্রতিক লেনদেন
              </div>
              <div className="text-xs font-bold text-primary-600">সব দেখুন</div>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                {
                  name: "করিম মিয়া",
                  amount: "৫০০",
                  type: "pabo",
                  desc: "ধারে পণ্য বিক্রয়",
                  time: "১০ মিনিট আগে",
                },
                {
                  name: "মায়ের দোয়া স্টোর",
                  amount: "২,০০০",
                  type: "debo",
                  desc: "দোকানের ভাড়া পরিশোধ",
                  time: "২৫ মিনিট আগে",
                },
                {
                  name: "রফিক সাহেব",
                  amount: "১,৫০০",
                  type: "pabo",
                  desc: "হাওলাত প্রদান",
                  time: "১ ঘন্টা আগে",
                },
                {
                  name: " পাইকারি আড়ৎ",
                  amount: "৫,০০০",
                  type: "debo",
                  desc: "মালামাল ক্রয় (বাকি)",
                  time: "২ ঘন্টা আগে",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner ${
                        item.type === "debo"
                          ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200/50"
                          : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50"
                      }`}
                    >
                      {item.type === "debo" ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500">
                        {item.desc} • {item.time}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-black font-mono ${
                      item.type === "debo"
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {item.type === "debo" ? "-" : "+"} ৳{item.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
