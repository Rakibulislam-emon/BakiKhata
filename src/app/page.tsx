"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

export default function LandingPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 left-0 bg-white/60 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                ব
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 hidden sm:block">
                বাকি খাতা
              </span>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#features"
                  className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  বৈশিষ্ট্য
                </a>
                <a
                  href="#how-it-works"
                  className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  কিভাবে কাজ করে
                </a>
                <a
                  href="#pricing"
                  className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ফ্রি ব্যবহার করুন
                </a>
              </div>
            </div>

            <div className="hidden md:block">
              <Link href="/login" className="btn-primary py-2.5 px-6 text-sm">
                লগ ইন করুন
              </Link>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="bg-white/50 inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/90 backdrop-blur-xl border-b border-secondary-100"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a
                  href="#features"
                  className="text-secondary-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  বৈশিষ্ট্য
                </a>
                <a
                  href="#how-it-works"
                  className="text-secondary-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  কিভাবে কাজ করে
                </a>
                <Link
                  href="/login"
                  className="w-full text-left bg-primary-50 text-primary-600 block px-3 py-2 rounded-md text-base font-medium mt-4"
                >
                  লগ ইন / সাইন আপ
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/60 shadow-sm backdrop-blur-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-medium text-secondary-600">
                ১০০% ফ্রি ও নিরাপদ
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-secondary-900 mb-8 leading-tight">
              ব্যবসার হিসাব রাখুন <br />
              <span className="hero-gradient-text">ডিজিটাল ও স্মার্ট</span> ভাবে
            </h1>

            <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary-600 mb-10 leading-relaxed">
              খাতা-কলমের ঝামেলা ভুলে যান। বাকি খাতা অ্যাপের মাধ্যমে আপনার
              ব্যবসার সব লেনদেন, বাকি ও পাওনা আদায়ের হিসাব রাখুন খুব সহজেই।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="btn-primary w-full sm:w-auto text-lg px-10 py-5 flex items-center justify-center gap-2"
              >
                এখনই শুরু করুন
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="btn-secondary w-full sm:w-auto text-lg px-10 py-5 group inline-flex items-center justify-center gap-2"
              >
                আরও জানুন
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 h-full w-full pointer-events-none" />
            <div className="glass-card p-2 md:p-3 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/40 border-white/60 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/5 to-purple-500/5 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Mockup UI Elements representing the dashboard */}
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-secondary-100 overflow-hidden h-[500px] md:h-auto md:aspect-[16/9] relative">
                <DashboardPreview />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              কেন ব্যবহার করবেন বাকি খাতা?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              আধুনিক ব্যবসার জন্য আধুনিক সমাধান। আপনার নিরাপত্তাই আমাদের
              অগ্রাধিকার।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />}
              title="সম্পূর্ণ নিরাপদ"
              description="আপনার তথ্য সম্পূর্ণ সুরক্ষিত এবং এনক্রিপ্ট করা থাকে। হারানোর বা নষ্ট হবার ভয় নেই।"
              delay={0}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-amber-500" />}
              title="সুপার ফাস্ট"
              description="বজ্রপাতেও থামবে না আপনার হিসাব। অ্যাপ চলবে সুপার ফাস্ট স্পিডে, যেকোনো ডিভাইসে।"
              delay={0.1}
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-primary-500" />}
              title="স্মার্ট রিপোর্ট"
              description="দিন, সপ্তাহ বা মাসের হিসাব দেখুন এক নজরে। ব্যবসার লাভ-ক্ষতি বোঝা এখন পানির মতো সহজ।"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-24 relative bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              কিভাবে কাজ করে? (How It Works)
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              মাত্র ৩টি সহজ ধাপে শুরু করুন আপনার ডিজিটাল হিসাবরক্ষণ যাত্রা।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary-200 via-purple-200 to-primary-200 -z-10" />

            <div className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <span className="text-3xl font-bold text-primary-600">১</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                অ্যাকাউন্ট খুলুন
              </h3>
              <p className="text-secondary-600">
                মাত্র ১ মিনিটে আপনার মোবাইল নম্বর বা ইমেইল দিয়ে ফ্রি অ্যাকাউন্ট
                খুলুন।
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <span className="text-3xl font-bold text-primary-600">২</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                লেনদেন যোগ করুন
              </h3>
              <p className="text-secondary-600">
                বাকির বা জমার হিসাব এন্ট্রি করুন। কাস্টমারের নাম ও টাকার পরিমাণ
                লিখুন।
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <span className="text-3xl font-bold text-primary-600">৩</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                রিপোর্ট দেখুন
              </h3>
              <p className="text-secondary-600">
                ড্যাশবোর্ডে দেখুন আপনার মোট পাওনা ও দেনা। ব্যবসার অবস্থা বুঝুন
                সহজেই।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900 z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/50 to-purple-900/90" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            আজই শুরু করুন আপনার <br /> ডিজিটাল যাত্রা
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
            হাজারো ব্যবসায়ী তাদের হিসাব নিকাশ সহজ করতে ব্যবহার করছেন বাকি খাতা।
            আপনি কেন পিছিয়ে থাকবেন?
          </p>
          <Link
            href="/login"
            className="bg-white text-primary-600 hover:bg-primary-50 font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl shadow-black/20 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
          >
            ফ্রি একাউন্ট খুলুন
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-primary-200 text-sm font-medium">
            কোন ক্রেডিট কার্ডের প্রয়োজন নেই • ১ মিনিটেই সেটআপ
          </p>
        </div>
      </section>

      {/* Footer */}
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
                ক্ষুদ্র ও মাঝারি ব্যবসার জন্য বাংলাদেশের সেরা ডিজিটাল হিসাবরক্ষণ
                অ্যাপ। আমরা বিশ্বাস করি প্রযুক্তির ছোঁয়ায় বদলে যাবে ব্যবসার ধরন।
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
                <li>
                  <a
                    href="tel:+8801700000000"
                    className="hover:text-primary-600 transition-colors"
                  >
                    যোগাযোগ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-secondary-900 mb-4">আইনি তথ্য</h4>
              <ul className="space-y-3 text-secondary-500">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-600 transition-colors"
                  >
                    গোপনীয়তা নীতি
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-600 transition-colors"
                  >
                    শর্তাবলী
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-400 text-sm">
              © ২০২৪ বাকি খাতা। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 rounded-full bg-secondary-100 hover:bg-primary-100 transition-colors cursor-pointer" />
              <div className="w-8 h-8 rounded-full bg-secondary-100 hover:bg-primary-100 transition-colors cursor-pointer" />
              <div className="w-8 h-8 rounded-full bg-secondary-100 hover:bg-primary-100 transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-card p-8 group hover:shadow-2xl transition-all duration-300 border-t-4 border-t-transparent hover:border-t-primary-500"
    >
      <div className="w-16 h-16 rounded-2xl bg-secondary-50 group-hover:bg-white flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-secondary-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}
