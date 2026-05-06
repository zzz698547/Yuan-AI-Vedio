import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/data/legal-pages";

export const metadata: Metadata = {
  title: "隱私權政策 | Veltrix AI",
  description: "Veltrix AI 隱私權政策與 Meta 授權資料使用說明。",
};

export default function PrivacyPage() {
  return <LegalPage content={legalPages.privacy} />;
}
