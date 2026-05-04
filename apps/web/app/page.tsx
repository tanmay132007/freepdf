"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  FileText,
  Server,
  Shield,
  UploadCloud,
  UserX
} from "lucide-react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { iconMap, tools } from "@/lib/tools";

const categories = ["All", "Edit", "Convert", "Compress", "Security", "AI Tools"];

const trustCards = [
  {
    icon: Shield,
    title: "256-bit SSL Encryption",
    description: "All transfers are encrypted end-to-end"
  },
  {
    icon: Clock,
    title: "Files Deleted After 1 Hour",
    description: "We never store your files longer than needed"
  },
  {
    icon: UserX,
    title: "No Account Required",
    description: "Use all 27 free tools without signing up"
  },
  {
    icon: Server,
    title: "Private Processing",
    description: "Files processed on secure servers, never shared"
  }
];

const comparisonRows = [
  ["Free tools", "27 ✓", "5 only", "8 only", "2 only"],
  ["No signup", "✓", "✗", "✗", "✗"],
  ["File deleted", "1 hour ✓", "1 hour", "2 hours", "stored"],
  ["AI tools", "✓", "paid", "paid", "paid"],
  ["Watermark free", "✓", "✗", "✗", "✗"]
];

export default function Home() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");

  const visibleTools = useMemo(() => {
    if (activeCategory === "All") {
      return tools;
    }

    return tools.filter((tool) => tool.category === activeCategory);
  }, [activeCategory]);

  const scrollToUpload = () => {
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white text-navy">
      <Navbar onGetStarted={scrollToUpload} />

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pb-16 pt-28">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600 text-white">
            <FileText aria-hidden="true" size={24} />
          </div>
          <span className="text-lg font-semibold">FreePDF Editor</span>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold tracking-normal sm:text-6xl">
          PDF tools that are fast, private, and simple to use.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-navy/60">
          Upload, edit, convert, compress, and organize PDFs from one clean
          workspace. No signup required, and files are deleted after 1 hour.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={scrollToUpload}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            <UploadCloud aria-hidden="true" size={18} />
            Start editing
          </button>
        </div>
      </section>

      <section id="upload" className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-syne text-3xl font-bold mb-4">
            Drop your PDF to get started
          </h2>
          <p className="text-navy/60 mb-8">
            No signup required. Files deleted after 1 hour.
          </p>
          <FileDropzone
            accept={["application/pdf"]}
            maxSizeMB={25}
            multiple={false}
            onFilesSelected={() => router.push("/tools/compress-pdf")}
            disabled={false}
          />
          <p className="mt-4 text-sm text-navy/40">
            🔒 SSL encrypted • ⏱ Deleted after 1 hour • ✓ No signup needed
          </p>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
              29 tools available
            </p>
            <h2 className="font-syne text-4xl font-bold tracking-normal">
              Choose a PDF Tool
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-zinc-200 bg-white text-navy/70 hover:border-red-200 hover:text-red-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleTools.map((tool) => {
            const Icon = iconMap[tool.icon];

            return (
              <button
                key={tool.slug}
                type="button"
                onClick={() => router.push("/tools/" + tool.slug)}
                className="group rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                  <Icon aria-hidden="true" size={24} />
                </div>
                <h3 className="text-lg font-bold text-navy">{tool.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-5 text-navy/55">
                  {tool.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                  Open tool
                  <Check aria-hidden="true" size={16} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-zinc-50 px-6 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-red-600">
                  <Icon aria-hidden="true" size={24} />
                </div>
                <h3 className="text-lg font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-navy/55">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-syne text-4xl font-bold tracking-normal">
            Why choose FreePDF over others?
          </h2>
          <div className="mt-8 overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-zinc-50 text-navy">
                <tr>
                  {["Feature", "FreePDF", "Smallpdf", "iLovePDF", "Adobe"].map(
                    (heading) => (
                      <th key={heading} className="px-5 py-4 font-bold">
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row[0]} className="border-t border-zinc-100">
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${cell}`}
                        className={`px-5 py-4 ${
                          index === 1
                            ? "font-bold text-red-600"
                            : "text-navy/70"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
