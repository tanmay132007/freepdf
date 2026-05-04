import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy — FreePDF"
};

const sections = [
  {
    title: "What Data We Collect",
    body: "FreePDF does not require an account for core PDF tools and does not intentionally collect personal information from your documents."
  },
  {
    title: "How Files Are Handled",
    body: "Uploaded files are used only to complete the PDF action you request. Files are deleted after 1 hour and are not kept longer than needed."
  },
  {
    title: "Cookies",
    body: "We use minimal cookies required for basic site functionality. We do not use invasive tracking cookies on free tools."
  },
  {
    title: "Third Party Services",
    body: "FreePDF may use infrastructure providers such as Supabase and Railway for authentication, storage, processing, and service operations."
  },
  {
    title: "Contact",
    body: "For privacy questions, contact support@freepdf.app."
  }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-navy">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-32">
        <h1 className="font-syne text-4xl font-bold">
          Privacy Policy — FreePDF
        </h1>
        <div className="mt-10 space-y-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="mt-3 leading-7 text-navy/65">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
