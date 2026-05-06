export type OAuthPopupMessage = {
  status: "success" | "error";
  message: string;
};

export function readCallbackMessage() {
  const params = new URLSearchParams(window.location.search);
  const oauth = params.get("oauth");
  const message = params.get("message");

  if (!oauth || !message) {
    return null;
  }

  window.history.replaceState(null, "", window.location.pathname);

  if (oauth === "success") {
    return { tone: "success" as const, message };
  }

  if (oauth === "error") {
    return { tone: "danger" as const, message };
  }

  return null;
}

export function readOAuthPopupMessage(data: unknown): OAuthPopupMessage | null {
  if (typeof data !== "object" || data === null || !("type" in data)) {
    return null;
  }

  const payload = data as {
    type?: unknown;
    status?: unknown;
    message?: unknown;
  };

  if (
    payload.type !== "social-oauth-complete" ||
    (payload.status !== "success" && payload.status !== "error") ||
    typeof payload.message !== "string"
  ) {
    return null;
  }

  return {
    status: payload.status,
    message: payload.message,
  };
}

export function getOAuthPopupFeatures() {
  return [
    "width=560",
    "height=760",
    "left=120",
    "top=80",
    "resizable=yes",
    "scrollbars=yes",
  ].join(",");
}

export function watchPopupClose(popup: Window, onClose: () => void) {
  const timer = window.setInterval(() => {
    if (!popup.closed) {
      return;
    }

    window.clearInterval(timer);
    onClose();
  }, 800);
}
