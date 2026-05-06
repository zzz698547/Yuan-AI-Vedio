import { RoutePlaceholderPage } from "@/components/empty-state/route-placeholder";
import { adminRoutePlaceholders } from "@/data/route-placeholders";

export default function AdminVideoGenerationPage() {
  return <RoutePlaceholderPage page={adminRoutePlaceholders.videoGeneration} />;
}
