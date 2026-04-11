import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Pillars from "@/components/landing/Pillars";
import Comparison from "@/components/landing/Comparison";
import Gallery from "@/components/landing/Gallery";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="bg-[#0B0B0B] min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <Pillars />
      <Comparison />
      <Gallery />
      <CTA />
      <footer className="border-t border-[#1E1E1E] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-700">SlateUI — Roblox UI Framework</span>
          <span className="text-xs font-mono text-slate-700">Plugin ID {134225039028358}</span>
        </div>
      </footer>
    </main>
  );
}
