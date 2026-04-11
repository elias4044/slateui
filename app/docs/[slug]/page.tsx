import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDocBySlug, getAllSlugs } from "@/lib/docs";
import ContentRenderer from "@/components/docs/ContentRenderer";
import DocPageHeader from "@/components/docs/DocPageHeader";
import DocContentMotion from "@/components/docs/DocContentMotion";
import DocSidebar from "@/components/docs/DocSidebar";

import Nav from "@/components/landing/Nav";
// ─── Static generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return {};
  return {
    title: `${doc.title} — SlateUI`,
    description: doc.description,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Top nav bar */}
      <header className="sticky top-0 z-5 pb-14">
        <Nav />
      </header>

      {/* Layout: sidebar + content */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
        <DocSidebar activeSlug={slug} />

        <main className="flex-1 min-w-0">
          <DocPageHeader title={doc.title} description={doc.description} />
          <DocContentMotion>
            <ContentRenderer sections={doc.sections} />
          </DocContentMotion>
        </main>
      </div>
    </div>
  );
}
