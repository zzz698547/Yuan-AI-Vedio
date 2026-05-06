import type {
  FacebookLoginFeature,
  FacebookProfile,
  FacebookProfileResponse,
} from "@/types/facebook-sdk";

export function getRequestedScopes(features: FacebookLoginFeature[]) {
  const scopes = new Set<string>();

  for (const feature of features) {
    for (const scope of feature.scopes) {
      scopes.add(scope);
    }
  }

  if (scopes.size === 0) {
    scopes.add("public_profile");
    scopes.add("email");
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

export function fetchFacebookProfile() {
  return new Promise<FacebookProfile>((resolve, reject) => {
    if (!canUseFacebookLoginInCurrentOrigin() || !window.FB) {
      reject(new Error("Facebook SDK 尚未準備完成。"));
      return;
    }

    window.FB.api(
      "/me",
      { fields: "id,name,picture.width(160).height(160)" },
      (response: FacebookProfileResponse) => {
        if (response.error) {
          reject(new Error(response.error.message));
          return;
        }

        resolve(response);
      }
    );
  });
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
