import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Sign In — FreePDF"
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white text-navy">
      <Navbar />
      <section className="mx-auto max-w-md px-6 pb-20 pt-32">
        <h1 className="font-syne text-4xl font-bold">Sign In</h1>
        <form className="mt-8 space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-zinc-200 px-4 py-3 outline-none transition focus:border-red-500"
          />
          <button
            type="button"
            className="w-full rounded-md bg-red-600 px-4 py-3 font-bold text-white transition hover:bg-red-700"
          >
            Sign In
          </button>
        </form>
      </section>
      <Footer />
    </main>
  );
}
