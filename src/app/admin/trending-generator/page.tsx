import { RoutePlaceholderPage } from "@/components/empty-state/route-placeholder";
import { adminRoutePlaceholders } from "@/data/route-placeholders";

export default function AdminTrendingGeneratorPage() {
  return (
    <RoutePlaceholderPage page={adminRoutePlaceholders.trendingGenerator} />
  );
}
