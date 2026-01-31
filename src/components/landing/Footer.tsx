"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-secondary-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
                ব
              </div>
              <span className="text-xl font-bold text-secondary-900">
                বাকি খাতা
              </span>
            </div>
            <p className="text-secondary-500 max-w-md leading-relaxed">
              ব্যক্তিগত ও ব্যবসায়িক প্রয়োজনে বাংলাদেশের সেরা ডিজিটাল হিসাবরক্ষণ
              অ্যাপ। আমরা বিশ্বাস করি প্রযুক্তির ছোঁয়ায় বদলে যাবে জীবনযাত্রা।
            </p>
          </div>

          <div>
            <h4 className="font-bold text-secondary-900 mb-4">লিংকসমূহ</h4>
            <ul className="space-y-3 text-secondary-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-600 transition-colors"
                >
                  হোম
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-primary-600 transition-colors"
                >
                  ফিচার
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@bakikhata.com"
                  className="hover:text-primary-600 transition-colors"
                >
                  সাহায্য
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-secondary-900 mb-4">সোশ্যাল</h4>
            <div className="flex gap-4 text-secondary-400">
              <a href="#" className="hover:text-primary-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-400">
          <p>© ২০২৪ বাকি খাতা। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-secondary-600">
              গোপনীয়তা নীতি
            </a>
            <a href="#" className="hover:text-secondary-600">
              শর্তাবলী
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
