"use client";

import { useEffect, useState } from "react";

import { FacebookAccountPreview } from "@/components/tenant-social/facebook-account-preview";
import { FacebookFeatureSelector } from "@/components/tenant-social/facebook-feature-selector";
import { FacebookLoginSummary } from "@/components/tenant-social/facebook-login-summary";
import { FacebookOfficialLoginButton } from "@/components/tenant-social/facebook-official-login-button";
import { facebookLoginFeatures } from "@/data/facebook-login-features";
import {
  getRequestedScopes,
  loadFacebookProfile,
  parseFacebookLoginButton,
} from "@/lib/facebook-sdk-client";
import {
  FACEBOOK_LOGIN_STATUS_EVENT,
  FACEBOOK_SDK_READY_EVENT,
  type FacebookLoginStatusResponse,
  type FacebookLoginUiStatus,
  type FacebookProfile,
} from "@/types/facebook-sdk";
import type { SocialPlatformBinding } from "@/types/integrations";

type FacebookLoginStatusCardProps = {
  platform?: SocialPlatformBinding;
};

export function FacebookLoginStatusCard({
  platform,
}: FacebookLoginStatusCardProps) {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const [status, setStatus] = useState<FacebookLoginUiStatus>(
    appId ? "checking" : "not_configured"
  );
  const [loginResponse, setLoginResponse] =
    useState<FacebookLoginStatusResponse | null>(null);
  const [profile, setProfile] = useState<FacebookProfile | null>(null);
  const [profileError, setProfileError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>(() =>
    facebookLoginFeatures.map((feature) => feature.id)
  );

  const selectedFeatures = facebookLoginFeatures.filter((feature) =>
    selectedFeatureIds.includes(feature.id)
  );
  const requestedScopes = getRequestedScopes(selectedFeatures, platform);
  const selectedFeatureLabels = selectedFeatures.map((feature) => feature.label);

  useEffect(() => {
    if (!appId) {
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
  }, [appId]);

  useEffect(() => {
    parseFacebookLoginButton();
  }, [requestedScopes]);

  function checkLoginStatus() {
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
    if (!window.FB) {
      return;
    }

    setIsChecking(true);
    window.FB.login(
      (response) => {
        setLoginResponse(response);
        setStatus(response.status);
        setIsChecking(false);

        if (response.status === "connected") {
          loadFacebookProfile(setProfile, setProfileError);
        }
      },
      {
        return_scopes: true,
        scope: requestedScopes,
      }
    );
  }

  function toggleFeature(featureId: string) {
    setSelectedFeatureIds((current) => {
      if (current.includes(featureId)) {
        return current.filter((id) => id !== featureId);
      }

      return [...current, featureId];
    });
  }

  return (
    <div className="mt-5 rounded-2xl border border-border bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <FacebookLoginSummary
        appId={appId}
        isChecking={isChecking}
        loginResponse={loginResponse}
        status={status}
        onCheck={checkLoginStatus}
        onLogin={loginWithFacebook}
      />

      <FacebookFeatureSelector
        disabled={!appId}
        features={facebookLoginFeatures}
        selectedFeatureIds={selectedFeatureIds}
        onToggle={toggleFeature}
      />

      <FacebookOfficialLoginButton requestedScopes={requestedScopes} />

      {profileError ? (
        <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
          {profileError}
        </p>
      ) : null}

      <FacebookAccountPreview
        profile={profile}
        selectedFeatureLabels={selectedFeatureLabels}
      />
    </div>
  );
}
