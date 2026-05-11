"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileKey, FileText } from "lucide-react";

type NavbarProps = {
  onGetStarted?: () => void;
};

export function Navbar({ onGetStarted }: NavbarProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.location.href = `/#${id}`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-gold/20 bg-linen/90 backdrop-blur transition-shadow ${
        hasScrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 font-bold text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald text-white">
            <FileText aria-hidden="true" size={20} />
          </span>
          SavePDF
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-navy/65 md:flex">
          <button
            type="button"
            onClick={() => scrollTo("tools")}
            className="transition hover:text-emerald"
          >
            Tools
          </button>
          <Link href="/pricing" className="transition hover:text-emerald">
            Pricing
          </Link>
          <Link href="/blog" className="transition hover:text-emerald">
            Blog
          </Link>
          <Link href="/about" className="transition hover:text-emerald">
            About
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gemini-key"
            className="inline-flex items-center gap-2 rounded-md bg-emerald px-4 py-2 text-sm font-bold text-white transition hover:bg-moss"
          >
            <FileKey aria-hidden="true" size={17} />
            Gemini Key
          </Link>
        </div>
      </nav>
    </header>
  );
}
