"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MegaCTA } from "@/components/landing/MegaCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

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
    <div className="min-h-screen overflow-x-hidden font-sans">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <MegaCTA />
      <Footer />
    </div>
  );
}
