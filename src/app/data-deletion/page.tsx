import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { legalPages } from "@/data/legal-pages";

export const metadata: Metadata = {
  title: "使用者資料刪除說明 | Veltrix AI",
  description: "Veltrix AI 使用者資料刪除流程與 Meta 授權資料移除說明。",
};

export default function DataDeletionPage() {
  return <LegalPage content={legalPages["data-deletion"]} />;
}
