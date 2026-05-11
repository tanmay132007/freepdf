import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-navy px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald">
              <FileText aria-hidden="true" size={20} />
            </span>
            SavePDF
          </div>
          <p className="mt-4 text-sm leading-6 text-white/55">
            Fast online PDF tools with private processing and automatic file
            deletion after 1 hour.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em]">
            Tools
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
            <Link href="/tools/compress-pdf" className="hover:text-white">
              Compress PDF
            </Link>
            <Link href="/tools/merge-pdf" className="hover:text-white">
              Merge PDF
            </Link>
            <Link href="/tools/split-pdf" className="hover:text-white">
              Split PDF
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em]">
            Company
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em]">
            Legal
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
            <Link href="/gemini-key" className="hover:text-white">
              Gemini Key
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <a
              href="https://www.savepdf.tech"
              className="hover:text-white"
            >
              www.savepdf.tech
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
