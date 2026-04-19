import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MegaCTA } from "@/components/landing/MegaCTA";
import { Footer } from "@/components/landing/Footer";
import { AuthRedirect } from "@/components/AuthRedirect";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      <AuthRedirect />
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
