"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Auth } from "@/components/Auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated, we should ideally redirect or show Auth
  // For now, if we are at root layout level, we might render Auth, but since this is (dashboard) layout,
  // we assume this route is protected.
  if (!session) {
    return <Auth />; // Or redirect to login page if we had one
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-400/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar />

      <main className="md:ml-64 relative z-10 min-h-screen flex flex-col transition-all duration-300">
        <Header />
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
