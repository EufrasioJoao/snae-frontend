import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navigation from "./_components/Navigation";
import HeroSection from "./_components/HeroSection";
import FeaturesSection from "./_components/FeaturesSection";
import StatsSection from "./_components/StatsSection";
import CTASection from "./_components/CTASection";
import Footer from "./_components/Footer";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <Navigation session={session} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
