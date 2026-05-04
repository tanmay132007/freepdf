import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Terms of Service — FreePDF"
};

const sections = [
  {
    title: "Acceptable Use",
    body: "Use FreePDF only for lawful PDF processing and document management. Do not abuse, overload, or interfere with the service."
  },
  {
    title: "File Size Limits",
    body: "Free tools may limit uploads by file size, file count, or processing time to keep the service fast and reliable for everyone."
  },
  {
    title: "No Illegal Content",
    body: "You may not upload, process, or distribute illegal, harmful, or infringing content through FreePDF."
  },
  {
    title: "Service Availability",
    body: "FreePDF aims to stay available, but access may be interrupted for maintenance, upgrades, outages, or infrastructure issues."
  },
  {
    title: "Limitation of Liability",
    body: "FreePDF is provided as-is. We are not liable for indirect losses, data loss, or damages arising from use of the service."
  }
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-navy">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-32">
        <h1 className="font-syne text-4xl font-bold">
          Terms of Service — FreePDF
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
