"use client";

import { useAuth } from "@/hooks/useAuth";
import { Auth } from "@/components/Auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If we are here, we are not logged in (or session is null), so show Auth
  // We can wrap Auth in a nice landing page layout if desired later.
  return <Auth />;
}
