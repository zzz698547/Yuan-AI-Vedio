import { TenantShell } from "@/components/app-shell/tenant-shell";
import { SocialPublishingClient } from "@/components/tenant-publishing/social-publishing-client";

export default function TenantSocialPublishingPage() {
  return (
    <TenantShell>
      <SocialPublishingClient />
    </TenantShell>
  );
}
