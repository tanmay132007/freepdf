import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ToolUpload } from "@/components/tools/ToolUpload";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { iconMap, tools } from "@/lib/tools";

type ToolPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: ToolPageProps) {
  const tool = tools.find((item) => item.slug === params.slug);

  if (!tool) {
    return {};
  }

  return {
    title: `${tool.name} Online Free — SavePDF`,
    description: `${tool.description} No signup required. Files deleted after 1 hour.`
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = tools.find((item) => item.slug === params.slug);

  if (!tool) {
    notFound();
  }

  const Icon = iconMap[tool.icon];

  return (
    <main className="min-h-screen bg-linen text-navy">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-32">
        <Link
          href="/#tools"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to tools
        </Link>
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald/10 text-emerald">
          <Icon aria-hidden="true" size={32} />
        </div>
        <h1 className="font-syne text-5xl font-bold">{tool.name}</h1>
        <p className="mt-4 text-lg leading-8 text-navy/60">
          {tool.description} Upload your file to start. No signup required, and
          files are deleted after 1 hour.
        </p>

        <div className="mt-10">
          <ToolUpload tool={tool} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
