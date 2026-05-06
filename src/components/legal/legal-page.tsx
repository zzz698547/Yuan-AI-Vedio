import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, ShieldCheck } from "lucide-react";

import type { LegalPageContent } from "@/data/legal-pages";

type LegalPageProps = {
  content: LegalPageContent;
};

export function LegalPage({ content }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-foreground md:px-8 lg:px-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(47,128,237,0.12),transparent_30%),radial-gradient(circle_at_86%_14%,rgba(34,197,94,0.10),transparent_26%),linear-gradient(180deg,#ffffff_0%,#F8FAFC_58%,#F7F9FC_100%)]" />

      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 pb-8 md:flex-row md:items-center md:justify-between">
          <Link
            href="/login"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-muted-foreground shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:text-primary hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
          >
            <ArrowLeft className="size-4" />
            返回登入頁
          </Link>

          <Image
            src="/brand-logo.png"
            alt="Veltrix AI 品牌 Logo"
            width={220}
            height={80}
            priority
            className="h-14 w-44 object-contain md:h-16 md:w-56"
          />
        </header>

        <section className="dashboard-card overflow-hidden p-0">
          <div className="border-b border-border bg-white px-5 py-6 md:px-8 md:py-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-[#EAF3FF] px-4 py-2 text-sm font-bold text-primary">
                  <ShieldCheck className="size-4" />
                  {content.eyebrow}
                </div>
                <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] text-foreground md:text-5xl">
                  {content.title}
                </h1>
                <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
                  {content.description}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-slate-50 p-4 text-sm text-muted-foreground md:min-w-64">
                <p className="font-bold text-foreground">Meta 後台用途</p>
                <p className="mt-1 leading-6">{content.metaPurpose}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
                  <CalendarDays className="size-4 text-primary" />
                  最後更新：{content.effectiveDate}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 bg-white p-5 md:p-8">
            {content.sections.map((section) => (
              <section
                key={section.title}
                className="rounded-[20px] border border-border bg-slate-50/70 p-5"
              >
                <h2 className="text-lg font-black tracking-[-0.02em] text-foreground">
                  {section.title}
                </h2>

                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 text-sm leading-7 text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.items ? (
                  <ul className="mt-3 space-y-2">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-7 text-muted-foreground"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <footer className="border-t border-border bg-slate-50 px-5 py-5 md:px-8">
            <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p>Veltrix AI 會依產品、法規與平台政策調整本頁內容。</p>
              <a
                href={`mailto:${content.contactEmail}`}
                className="inline-flex items-center gap-2 font-bold text-primary transition hover:text-blue-700"
              >
                <Mail className="size-4" />
                {content.contactEmail}
              </a>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
