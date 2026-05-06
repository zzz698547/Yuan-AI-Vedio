import { Skeleton } from "@/components/ui/skeleton";

type TenantAiStatusMessageProps = {
  tone: "success" | "danger";
  message: string;
};

export function TenantAiStatusMessage({
  tone,
  message,
}: TenantAiStatusMessageProps) {
  const toneClass =
    tone === "success"
      ? "border-green-100 bg-green-50 text-success"
      : "border-red-100 bg-red-50 text-danger";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${toneClass}`}>
      {message}
    </div>
  );
}

export function TenantAiProviderLoadingGrid() {
  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {[0, 1].map((item) => (
        <div key={item} className="dashboard-card">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="mt-4 h-24 rounded-2xl" />
          <Skeleton className="mt-4 h-11 rounded-[14px]" />
        </div>
      ))}
    </section>
  );
}
