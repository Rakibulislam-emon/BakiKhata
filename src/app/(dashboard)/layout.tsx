"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, lazy, Suspense } from "react";
import { Auth } from "@/components/Auth";

const Sidebar = lazy(() =>
  import("@/components/layout/Sidebar").then((m) => ({ default: m.Sidebar }))
);
const MobileSidebar = lazy(() =>
  import("@/components/layout/MobileSidebar").then((m) => ({
    default: m.MobileSidebar,
  }))
);
const BottomNav = lazy(() =>
  import("@/components/layout/BottomNav").then((m) => ({ default: m.BottomNav }))
);
const Header = lazy(() =>
  import("@/components/layout/Header").then((m) => ({ default: m.Header }))
);
const TransactionsProvider = lazy(() =>
  import("@/context/TransactionsContext").then((m) => ({
    default: m.TransactionsProvider,
  }))
);

function DashboardShell({
  children,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  children: React.ReactNode;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      }
    >
      <TransactionsProvider>
        <div className="min-h-screen bg-background relative overflow-x-hidden font-sans">
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-400/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-400/5 rounded-full blur-[120px]" />
          </div>

          <Sidebar />
          <MobileSidebar
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />

          <main className="md:ml-64 relative z-10 min-h-screen flex flex-col transition-all duration-300 pb-24 md:pb-0">
            <Header onMenuClick={() => setMobileMenuOpen(true)} />
            <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>

          <BottomNav />
        </div>
      </TransactionsProvider>
    </Suspense>
  );
}

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
    <DashboardShell
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
    >
      {children}
    </DashboardShell>
  );
}
