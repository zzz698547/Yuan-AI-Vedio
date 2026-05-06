import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/data/legal-pages";

export const metadata: Metadata = {
  title: "服務條款 | Veltrix AI",
  description: "Veltrix AI 服務條款、AI 內容規範與第三方平台授權說明。",
};

export default function TermsPage() {
  return <LegalPage content={legalPages.terms} />;
}
