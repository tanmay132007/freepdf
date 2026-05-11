"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileKey, Shield, Sparkles, Trash2 } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function GeminiKeyPage() {
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGeminiApiKey(window.localStorage.getItem("savepdf_gemini_api_key") ?? "");
  }, []);

  const saveKey = () => {
    window.localStorage.setItem("savepdf_gemini_api_key", geminiApiKey.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const clearKey = () => {
    window.localStorage.removeItem("savepdf_gemini_api_key");
    setGeminiApiKey("");
    setSaved(false);
  };

  return (
    <main className="min-h-screen bg-linen text-navy">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-32">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
          <FileKey aria-hidden="true" size={34} />
        </div>
        <h1 className="font-syne text-5xl font-bold tracking-normal">Gemini Key</h1>
        <p className="mt-4 text-lg leading-8 text-navy/60">
          Save your Gemini API key in this browser to run AI Summarizer, OCR,
          Translate, and Compare. SavePDF does not require sign in.
        </p>

        <section className="mt-10 rounded-lg border border-gold/25 bg-white p-6 shadow-sm">
          <label className="text-sm font-bold text-navy" htmlFor="gemini-key">
            Gemini API key
          </label>
          <input
            id="gemini-key"
            type="password"
            value={geminiApiKey}
            onChange={(event) => setGeminiApiKey(event.target.value)}
            placeholder="AIza..."
            className="mt-3 w-full rounded-md border border-gold/25 px-4 py-3 outline-none transition focus:border-emerald"
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveKey}
              className="inline-flex items-center gap-2 rounded-md bg-emerald px-4 py-2 text-sm font-bold text-white transition hover:bg-moss"
            >
              <Sparkles aria-hidden="true" size={17} />
              Save key
            </button>
            <button
              type="button"
              onClick={clearKey}
              className="inline-flex items-center gap-2 rounded-md border border-gold/25 px-4 py-2 text-sm font-bold text-navy/70 transition hover:border-emerald/25 hover:text-emerald"
            >
              <Trash2 aria-hidden="true" size={17} />
              Clear
            </button>
          </div>
          {saved ? (
            <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              Gemini key saved in this browser.
            </p>
          ) : null}
        </section>

        <section className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <Shield aria-hidden="true" className="mt-1 text-amber-700" size={20} />
            <p className="text-sm leading-6 text-amber-900">
              Your key is stored only in localStorage on this device. AI tools
              send selected files directly from your browser to Google Gemini
              when you run them.
            </p>
          </div>
        </section>

        <Link
          href="/#tools"
          className="mt-8 inline-flex rounded-md bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-navy/90"
        >
          Open tools
        </Link>
      </section>
      <Footer />
    </main>
  );
}
