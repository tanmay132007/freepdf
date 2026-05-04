import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Blog — FreePDF"
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white text-navy">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-32">
        <h1 className="font-syne text-5xl font-bold">Blog</h1>
        <p className="mt-5 text-lg leading-8 text-navy/60">
          Practical PDF guides, workflow tips, and updates from FreePDF.
        </p>
      </section>
      <Footer />
    </main>
  );
}
