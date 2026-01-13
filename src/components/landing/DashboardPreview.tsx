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
    <div className="w-full h-full bg-secondary-50/50 flex overflow-hidden font-sans select-none pointer-events-none">
      {/* Mock Sidebar */}
      <div className="hidden md:flex flex-col w-56 bg-white border-r border-secondary-100 p-4 gap-6">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
            ব
          </div>
          <span className="font-bold text-secondary-900">বাকি খাতা</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
            <BarChart3 className="w-4 h-4" />
            ড্যাশবোর্ড
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-secondary-600 rounded-lg text-sm font-medium">
            <Users className="w-4 h-4" />
            হিসাবের তালিকা
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-secondary-600 rounded-lg text-sm font-medium">
            <Wallet className="w-4 h-4" />
            লেনদেন সমূহ
          </div>
        </div>
      </div>

      {/* Mock Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mock Header */}
        <div className="h-16 border-b border-secondary-100 bg-white/50 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="text-secondary-900 font-semibold">ড্যাশবোর্ড</div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center">
              <Search className="w-4 h-4 text-secondary-500" />
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center">
              <Bell className="w-4 h-4 text-secondary-500" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-100 to-purple-100 border border-white shadow-sm" />
          </div>
        </div>

        {/* Mock Content Body */}
        <div className="flex-1 p-6 overflow-hidden">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-secondary-100 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium uppercase tracking-wider">
                <ArrowUpRight className="w-3 h-3" />
                মোট পাবো (Credit)
              </div>
              <div className="text-2xl font-bold text-secondary-900">
                ৳ ৫৪,৫০০
              </div>
              <div className="text-xs text-secondary-500 flex items-center gap-1">
                ৫ জন আপনার কাছে ঋণী
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-secondary-100 space-y-2">
              <div className="flex items-center gap-2 text-rose-600 text-xs font-medium uppercase tracking-wider">
                <ArrowDownLeft className="w-3 h-3" />
                মোট দেব (Debit)
              </div>
              <div className="text-2xl font-bold text-secondary-900">
                ৳ ১২,২০০
              </div>
              <div className="text-xs text-secondary-500 flex items-center gap-1">
                ৩ জনের কাছে আপনি ঋণী
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-secondary-100 space-y-2">
              <div className="flex items-center gap-2 text-secondary-500 text-xs font-medium uppercase tracking-wider">
                <Wallet className="w-3 h-3" />
                নিট ব্যালেন্স
              </div>
              <div className="text-2xl font-bold text-primary-600">
                ৳ ৪২,৩০০
              </div>
              <div className="text-xs text-secondary-500">
                সব মিলিয়ে বর্তমান অবস্থা
              </div>
            </div>
          </div>

          {/* Recent List Mock */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-secondary-50 flex items-center justify-between">
              <div className="text-sm font-semibold text-secondary-900">
                সাম্প্রতিক লেনদেন
              </div>
              <div className="text-xs text-primary-600">সব দেখুন</div>
            </div>
            <div className="divide-y divide-secondary-50">
              {[
                {
                  name: "করিম মিয়া",
                  amount: "৫০০",
                  type: "pabo", // I will get (Positive)
                  desc: "ধারে পণ্য বিক্রয়",
                  time: "১০ মিনিট আগে",
                },
                {
                  name: "মায়ের দোয়া স্টোর",
                  amount: "২,০০০",
                  type: "debo", // I will give (Negative/Expense/Borrow)
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
                <div key={i} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.type === "debo"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {item.type === "debo" ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-secondary-500">
                        {item.desc} • {item.time}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      item.type === "debo"
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {item.type === "debo" ? "-" : "+"} ৳ {item.amount}
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
