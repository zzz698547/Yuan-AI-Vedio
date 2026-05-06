export const FACEBOOK_LOGIN_STATUS_EVENT = "veltrix:facebook-login-status";
export const FACEBOOK_SDK_READY_EVENT = "veltrix:facebook-sdk-ready";

export type FacebookLoginStatus = "connected" | "not_authorized" | "unknown";

export type FacebookLoginUiStatus =
  | FacebookLoginStatus
  | "checking"
  | "not_configured";

export type FacebookAuthResponse = {
  accessToken: string;
  expiresIn: number | string;
  signedRequest: string;
  userID: string;
};

export type FacebookLoginStatusResponse = {
  status: FacebookLoginStatus;
  authResponse?: FacebookAuthResponse;
};

export type FacebookLoginOptions = {
  auth_type?: string;
  return_scopes?: boolean;
  scope?: string;
};

export type FacebookLoginFeature = {
  id: string;
  description: string;
  label: string;
  scopes: string[];
};

export type FacebookProfile = {
  id: string;
  name: string;
  picture?: {
    data?: {
      is_silhouette?: boolean;
      url?: string;
    };
  };
};

export type FacebookApiError = {
  code?: number;
  message: string;
  type?: string;
};

export type FacebookProfileResponse = FacebookProfile & {
  error?: FacebookApiError;
};

export type FacebookSdkReadyDetail = {
  apiVersion: string;
  appId: string;
};

declare global {
  interface Window {
    FB?: {
      AppEvents: {
        logPageView: () => void;
      };
      getLoginStatus: (
        callback: (response: FacebookLoginStatusResponse) => void
      ) => void;
      api: (
        path: string,
        params: { fields: string },
        callback: (response: FacebookProfileResponse) => void
      ) => void;
      init: (config: {
        appId: string;
        cookie: boolean;
        version: string;
        xfbml: boolean;
      }) => void;
      login: (
        callback: (response: FacebookLoginStatusResponse) => void,
        options?: FacebookLoginOptions
      ) => void;
      XFBML?: {
        parse: (element?: Element | null) => void;
      };
    };
    __veltrixFacebookLoginStatus?: FacebookLoginStatusResponse;
    checkLoginState?: () => void;
    fbAsyncInit?: () => void;
    veltrixFacebookStatusChangeCallback?: (
      response: FacebookLoginStatusResponse
    ) => void;
  }

  interface WindowEventMap {
    [FACEBOOK_LOGIN_STATUS_EVENT]: CustomEvent<FacebookLoginStatusResponse>;
    [FACEBOOK_SDK_READY_EVENT]: CustomEvent<FacebookSdkReadyDetail>;
  }
}
