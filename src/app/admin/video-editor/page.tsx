import { RoutePlaceholderPage } from "@/components/empty-state/route-placeholder";
import { adminRoutePlaceholders } from "@/data/route-placeholders";

export default function AdminVideoEditorPage() {
  return <RoutePlaceholderPage page={adminRoutePlaceholders.videoEditor} />;
}
