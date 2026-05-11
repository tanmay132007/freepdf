import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Blog — SavePDF"
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-linen text-navy">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-32">
        <h1 className="font-syne text-5xl font-bold">Blog</h1>
        <p className="mt-5 text-lg leading-8 text-navy/60">
          Practical PDF guides, workflow tips, and updates from SavePDF.
        </p>
      </section>
      <Footer />
    </main>
  );
}
