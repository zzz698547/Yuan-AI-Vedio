import type {
  FacebookLoginFeature,
  FacebookProfile,
  FacebookProfileResponse,
} from "@/types/facebook-sdk";
import type { SocialPlatformBinding } from "@/types/integrations";

export function getRequestedScopes(
  features: FacebookLoginFeature[],
  platform?: SocialPlatformBinding
) {
  const scopes = new Set<string>();

  for (const feature of features) {
    for (const scope of feature.scopes) {
      scopes.add(scope);
    }
  }

  if (scopes.size === 0 && platform?.scopes.length) {
    for (const scope of platform.scopes) {
      scopes.add(scope);
    }
  }

  if (scopes.size === 0) {
    scopes.add("public_profile");
  }

  return Array.from(scopes).join(",");
}

export function loadFacebookProfile(
  setProfile: (profile: FacebookProfile | null) => void,
  setProfileError: (message: string) => void
) {
  if (!canUseFacebookLoginInCurrentOrigin() || !window.FB) {
    return;
  }

  setProfileError("");
  window.FB.api(
    "/me",
    { fields: "id,name,picture.width(160).height(160)" },
    (response: FacebookProfileResponse) => {
      if (response.error) {
        setProfile(null);
        setProfileError(response.error.message);
        return;
      }

      setProfile(response);
    }
  );
}

export function canUseFacebookLoginInCurrentOrigin() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.location.protocol === "https:";
}

export function parseFacebookLoginButton() {
  if (!canUseFacebookLoginInCurrentOrigin() || !window.FB) {
    return;
  }

  const container = document.getElementById("veltrix-facebook-login-plugin");
  window.FB.XFBML?.parse(container);
}
