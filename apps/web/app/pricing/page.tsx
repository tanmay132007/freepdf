import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Pricing — SavePDF"
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-linen text-navy">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-32 text-center">
        <h1 className="font-syne text-5xl font-bold">Pricing</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-navy/60">
          Start with 29 free PDF tools. Premium limits and team features can be
          added as the product grows.
        </p>
      </section>
      <Footer />
    </main>
  );
}
