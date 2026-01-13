"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Auth } from "@/components/Auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-400/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar />
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="md:ml-64 relative z-10 min-h-screen flex flex-col transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
