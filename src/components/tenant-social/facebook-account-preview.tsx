"use client";

import { Badge } from "@/components/ui/badge";
import type { FacebookProfile } from "@/types/facebook-sdk";

type FacebookAccountPreviewProps = {
  profile: FacebookProfile | null;
  selectedFeatureLabels: string[];
};

export function FacebookAccountPreview({
  profile,
  selectedFeatureLabels,
}: FacebookAccountPreviewProps) {
  if (!profile) {
    return null;
  }

  const avatarUrl = profile.picture?.data?.url;

  return (
    <div className="mt-4 rounded-2xl border border-green-100 bg-green-50/70 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={`${profile.name} 的 Facebook 頭像`}
              className="size-14 rounded-2xl border border-white object-cover shadow-sm"
            />
          ) : (
            <div className="grid size-14 place-items-center rounded-2xl bg-white text-lg font-bold text-primary">
              {profile.name.slice(0, 1)}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-success">授權成功</p>
            <h4 className="text-base font-black text-foreground">
              {profile.name}
            </h4>
            <p className="text-xs text-muted-foreground">Facebook ID：{profile.id}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {selectedFeatureLabels.map((label) => (
            <Badge key={label} variant="success">
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
