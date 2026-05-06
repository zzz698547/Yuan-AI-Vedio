"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { FacebookAccountPreview } from "@/components/tenant-social/facebook-account-preview";
import { FacebookFeatureSelector } from "@/components/tenant-social/facebook-feature-selector";
import { FacebookLoginSummary } from "@/components/tenant-social/facebook-login-summary";
import { FacebookOfficialLoginButton } from "@/components/tenant-social/facebook-official-login-button";
import { facebookLoginFeatures } from "@/data/facebook-login-features";
import {
  canUseFacebookLoginInCurrentOrigin,
  fetchFacebookProfile,
  getRequestedScopes,
  loadFacebookProfile,
  parseFacebookLoginButton,
} from "@/lib/facebook-sdk-client";
import { manualBindSocialAccount } from "@/lib/integrations-api";
import { getMockSession } from "@/lib/mock-auth";
import {
  FACEBOOK_LOGIN_STATUS_EVENT,
  FACEBOOK_SDK_READY_EVENT,
  type FacebookLoginStatusResponse,
  type FacebookLoginUiStatus,
  type FacebookProfile,
} from "@/types/facebook-sdk";

export function FacebookLoginStatusCard() {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const canUseFacebookLogin = useSyncExternalStore(
    subscribeToLocationChanges,
    canUseFacebookLoginInCurrentOrigin,
    getServerFacebookLoginSupport
  );
  const [status, setStatus] = useState<FacebookLoginUiStatus>(
    appId ? "checking" : "not_configured"
  );
  const [loginResponse, setLoginResponse] =
    useState<FacebookLoginStatusResponse | null>(null);
  const [profile, setProfile] = useState<FacebookProfile | null>(null);
  const [profileError, setProfileError] = useState("");
  const [bindNotice, setBindNotice] = useState("");
  const [bindError, setBindError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const advancedScopesEnabled =
    process.env.NEXT_PUBLIC_FACEBOOK_ADVANCED_SCOPES === "true";
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>(() =>
    ["basic-profile"]
  );

  const selectedFeatures = facebookLoginFeatures.filter((feature) =>
    selectedFeatureIds.includes(feature.id)
  );
  const requestedScopes = getRequestedScopes(selectedFeatures);
  const selectedFeatureLabels = selectedFeatures.map((feature) => feature.label);
  const displayStatus: FacebookLoginUiStatus = appId
    ? canUseFacebookLogin
      ? status
      : "https_required"
    : "not_configured";

  useEffect(() => {
    if (!appId || !canUseFacebookLogin) {
      return;
    }

    function applyResponse(response: FacebookLoginStatusResponse) {
      setLoginResponse(response);
      setStatus(response.status);
      setIsChecking(false);

      if (response.status === "connected") {
        loadFacebookProfile(setProfile, setProfileError);
      } else {
        setProfile(null);
      }
    }

    function requestStatus() {
      if (!window.FB) {
        return;
      }

      setIsChecking(true);
      window.FB.getLoginStatus(applyResponse);
    }

    function handleStatus(event: WindowEventMap[typeof FACEBOOK_LOGIN_STATUS_EVENT]) {
      applyResponse(event.detail);
    }

    function handleSdkReady() {
      requestStatus();
      parseFacebookLoginButton();
    }

    window.addEventListener(FACEBOOK_LOGIN_STATUS_EVENT, handleStatus);
    window.addEventListener(FACEBOOK_SDK_READY_EVENT, handleSdkReady);

    if (window.__veltrixFacebookLoginStatus) {
      applyResponse(window.__veltrixFacebookLoginStatus);
    } else {
      requestStatus();
    }

    return () => {
      window.removeEventListener(FACEBOOK_LOGIN_STATUS_EVENT, handleStatus);
      window.removeEventListener(FACEBOOK_SDK_READY_EVENT, handleSdkReady);
    };
  }, [appId, canUseFacebookLogin]);

  useEffect(() => {
    if (!canUseFacebookLogin) {
      return;
    }

    parseFacebookLoginButton();
  }, [canUseFacebookLogin, requestedScopes]);

  function checkLoginStatus() {
    if (!canUseFacebookLoginInCurrentOrigin()) {
      return;
    }

    if (!window.FB) {
      setStatus(appId ? "checking" : "not_configured");
      return;
    }

    setIsChecking(true);
    window.FB.getLoginStatus((response) => {
      setLoginResponse(response);
      setStatus(response.status);
      setIsChecking(false);

      if (response.status === "connected") {
        loadFacebookProfile(setProfile, setProfileError);
      } else {
        setProfile(null);
      }
    });
  }

  function loginWithFacebook() {
    if (!canUseFacebookLoginInCurrentOrigin()) {
      return;
    }

    if (!window.FB) {
      return;
    }

    setIsChecking(true);
    setBindNotice("");
    setBindError("");
    window.FB.login(
      async (response) => {
        setLoginResponse(response);
        setStatus(response.status);
        setIsChecking(false);

        if (response.status === "connected") {
          loadFacebookProfile(setProfile, setProfileError);
          await bindFacebookAccount(response);
        }
      },
      {
        return_scopes: true,
        scope: requestedScopes,
      }
    );
  }

  function toggleFeature(featureId: string) {
    const feature = facebookLoginFeatures.find((item) => item.id === featureId);

    if (feature?.requiresAppReview && !advancedScopesEnabled) {
      return;
    }

    setSelectedFeatureIds((current) => {
      if (current.includes(featureId)) {
        return current.filter((id) => id !== featureId);
      }

      return [...current, featureId];
    });
  }

  async function bindFacebookAccount(response: FacebookLoginStatusResponse) {
    const accessToken = response.authResponse?.accessToken;

    if (!accessToken) {
      setBindError("Facebook 未回傳 Access Token，請重新登入。");
      return;
    }

    try {
      const facebookProfile = await fetchFacebookProfile();
      setProfile(facebookProfile);
      await manualBindSocialAccount({
        platform: "facebook",
        accountName: facebookProfile.name,
        tenantName: getTenantName(),
        accessToken,
        scopes: getGrantedScopes(response, requestedScopes),
      });
      setBindNotice("Facebook 帳號已成功一鍵綁定，畫面即將重新整理。");
      window.setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setBindError(
        error instanceof Error ? error.message : "Facebook 一鍵綁定失敗。"
      );
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-border bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <FacebookLoginSummary
        appId={appId}
        canUseFacebookLogin={canUseFacebookLogin}
        isChecking={isChecking}
        loginResponse={loginResponse}
        status={displayStatus}
        onCheck={checkLoginStatus}
        onLogin={loginWithFacebook}
      />

      <FacebookFeatureSelector
        advancedScopesEnabled={advancedScopesEnabled}
        disabled={!appId}
        features={facebookLoginFeatures}
        selectedFeatureIds={selectedFeatureIds}
        onToggle={toggleFeature}
      />

      <FacebookOfficialLoginButton
        canUseFacebookLogin={canUseFacebookLogin}
        requestedScopes={requestedScopes}
      />

      {profileError ? (
        <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
          {profileError}
        </p>
      ) : null}
      {bindNotice ? (
        <p className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-success">
          {bindNotice}
        </p>
      ) : null}
      {bindError ? (
        <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
          {bindError}
        </p>
      ) : null}

      <FacebookAccountPreview
        profile={profile}
        selectedFeatureLabels={selectedFeatureLabels}
      />
    </div>
  );
}

function getServerFacebookLoginSupport() {
  return true;
}

function getGrantedScopes(
  response: FacebookLoginStatusResponse,
  requestedScopes: string
) {
  const grantedScopes = response.authResponse?.grantedScopes || requestedScopes;
  return grantedScopes.split(",").map((scope) => scope.trim()).filter(Boolean);
}

function getTenantName() {
  const session = getMockSession();
  return session?.tenantName || session?.userName || "目前租戶";
}

function subscribeToLocationChanges(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener("popstate", onStoreChange);

  return () => {
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
  };
}
