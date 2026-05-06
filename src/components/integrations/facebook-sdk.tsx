import Script from "next/script";

import {
  FACEBOOK_LOGIN_STATUS_EVENT,
  FACEBOOK_SDK_READY_EVENT,
} from "@/types/facebook-sdk";

const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
const facebookApiVersion =
  process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION ?? "v25.0";
const facebookSdkLocale =
  process.env.NEXT_PUBLIC_FACEBOOK_SDK_LOCALE ?? "en_US";

export function FacebookSdk() {
  if (!facebookAppId) {
    return null;
  }

  const sdkUrl = `https://connect.facebook.net/${facebookSdkLocale}/sdk.js`;
  const initScript = `
    window.veltrixCanUseFacebookLogin = window.location.protocol === "https:";

    window.veltrixFacebookStatusChangeCallback = function(response) {
      window.__veltrixFacebookLoginStatus = response;
      window.dispatchEvent(new CustomEvent(${JSON.stringify(
        FACEBOOK_LOGIN_STATUS_EVENT
      )}, { detail: response }));
    };

    window.checkLoginState = function() {
      if (!window.FB || !window.veltrixCanUseFacebookLogin) { return; }

      window.FB.getLoginStatus(function(response) {
        window.veltrixFacebookStatusChangeCallback(response);
      });
    };

    window.fbAsyncInit = function() {
      window.FB.init({
        appId: ${JSON.stringify(facebookAppId)},
        cookie: true,
        xfbml: window.veltrixCanUseFacebookLogin,
        version: ${JSON.stringify(facebookApiVersion)}
      });

      window.FB.AppEvents.logPageView();
      window.dispatchEvent(new CustomEvent(${JSON.stringify(
        FACEBOOK_SDK_READY_EVENT
      )}, { detail: {
        appId: ${JSON.stringify(facebookAppId)},
        apiVersion: ${JSON.stringify(facebookApiVersion)},
        canUseFacebookLogin: window.veltrixCanUseFacebookLogin
      }}));

      if (window.veltrixCanUseFacebookLogin) {
        window.checkLoginState();
      }
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s);
      js.id = id;
      js.src = ${JSON.stringify(sdkUrl)};
      fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "facebook-jssdk"));
  `;

  return (
    <>
      <div id="fb-root" />
      <Script id="facebook-sdk" strategy="afterInteractive">
        {initScript}
      </Script>
    </>
  );
}
