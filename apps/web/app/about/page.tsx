import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "About — FreePDF"
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-navy">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-32">
        <h1 className="font-syne text-5xl font-bold">About FreePDF</h1>
        <p className="mt-5 text-lg leading-8 text-navy/60">
          FreePDF helps people handle everyday PDF work quickly, privately, and
          without unnecessary account walls.
        </p>
      </section>
      <Footer />
    </main>
  );
}
