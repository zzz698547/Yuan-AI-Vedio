type SocialStatusMessageProps = {
  tone: "success" | "danger";
  message: string;
};

export function SocialStatusMessage({ tone, message }: SocialStatusMessageProps) {
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
