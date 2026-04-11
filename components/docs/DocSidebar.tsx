import Link from "next/link";
import { getAllSlugs } from "@/lib/docs";

export default function DocSidebar({ activeSlug }: { activeSlug: string }) {
  const slugs = getAllSlugs();

  return (
    <nav className="sticky top-8 w-52 shrink-0 hidden lg:block">
      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-4 px-2">
        Components
      </p>
      <ul className="flex flex-col gap-0.5">
        {slugs.map((slug) => {
          const isActive = slug === activeSlug;
          return (
            <li key={slug}>
              <Link
                href={`/docs/${slug}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                  isActive
                    ? "bg-[#1A1A1A] text-white border border-[#2A2A2A]"
                    : "text-slate-500 hover:text-slate-200 hover:bg-[#141414]"
                }`}
              >
                {slug}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
