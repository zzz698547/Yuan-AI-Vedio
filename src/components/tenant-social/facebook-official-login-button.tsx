"use client";

type FacebookOfficialLoginButtonProps = {
  canUseFacebookLogin: boolean;
  requestedScopes: string;
};

export function FacebookOfficialLoginButton({
  canUseFacebookLogin,
  requestedScopes,
}: FacebookOfficialLoginButtonProps) {
  const loginButtonHtml = `<fb:login-button scope="${requestedScopes}" onlogin="checkLoginState();" size="large"></fb:login-button>`;

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-blue-100 bg-blue-50/60 p-4">
      <p className="text-sm font-bold text-foreground">Facebook 官方登入按鈕</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        下方按鈕使用 Meta XFBML login button，預設只送 public_profile 與 email，避免未審核權限造成 Invalid Scopes。
      </p>
      {canUseFacebookLogin ? (
        <div
          id="veltrix-facebook-login-plugin"
          key={requestedScopes}
          className="mt-3 min-h-10"
          dangerouslySetInnerHTML={{ __html: loginButtonHtml }}
        />
      ) : (
        <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs font-semibold leading-5 text-warning">
          本機 http 預覽已暫停渲染官方按鈕，避免 Facebook SDK 報錯。請使用 Vercel HTTPS 網址測試正式授權。
        </div>
      )}
    </div>
  );
}
