"use client";

import { Settings, User, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">সেটিংস</h1>
        <p className="text-secondary-500">আপনার অ্যাকাউন্ট এবং অ্যাপ সেটিংস</p>
      </div>

      <div className="grid gap-6">
        <div className="glass-card p-6 flex items-start gap-4">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              প্রোফাইল সেটিংস
            </h3>
            <p className="text-secondary-500 text-sm mt-1">
              আপনার নাম, ছবি এবং অন্যান্য তথ্য পরিবর্তন করুন।
            </p>
            <button className="mt-4 px-4 py-2 bg-secondary-100 text-secondary-600 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
              এডিট প্রোফাইল
            </button>
          </div>
        </div>

        <div className="glass-card p-6 flex items-start gap-4 opacity-75">
          <div className="p-3 bg-secondary-100 text-secondary-600 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              নোটিফিকেশন
            </h3>
            <p className="text-secondary-500 text-sm mt-1">
              লেনদেনের আপডেট এবং অ্যালার্ট ম্যানেজ করুন।
            </p>
            <span className="mt-4 inline-block text-xs font-medium bg-secondary-100 text-secondary-500 px-2 py-1 rounded">
              শীঘ্রই আসছে
            </span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-start gap-4 opacity-75">
          <div className="p-3 bg-secondary-100 text-secondary-600 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              ভাষা ও রিজিয়ন
            </h3>
            <p className="text-secondary-500 text-sm mt-1">
              অ্যাপের ভাষা এবং কারেন্সি পরিবর্তন করুন।
            </p>
            <span className="mt-4 inline-block text-xs font-medium bg-secondary-100 text-secondary-500 px-2 py-1 rounded">
              শীঘ্রই আসছে
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
