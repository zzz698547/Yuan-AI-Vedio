import { RoutePlaceholderPage } from "@/components/empty-state/route-placeholder";
import { adminRoutePlaceholders } from "@/data/route-placeholders";

export default function AdminRolesPage() {
  return <RoutePlaceholderPage page={adminRoutePlaceholders.roles} />;
}
