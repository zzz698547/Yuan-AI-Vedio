"use client";

type FacebookOfficialLoginButtonProps = {
  requestedScopes: string;
};

export function FacebookOfficialLoginButton({
  requestedScopes,
}: FacebookOfficialLoginButtonProps) {
  const loginButtonHtml = `<fb:login-button scope="${requestedScopes}" onlogin="checkLoginState();" size="large"></fb:login-button>`;

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-blue-100 bg-blue-50/60 p-4">
      <p className="text-sm font-bold text-foreground">Facebook 官方登入按鈕</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        下方按鈕使用 Meta XFBML login button，onlogin 會呼叫 checkLoginState() 並重新取得登入狀態。
      </p>
      <div
        id="veltrix-facebook-login-plugin"
        key={requestedScopes}
        className="mt-3 min-h-10"
        dangerouslySetInnerHTML={{ __html: loginButtonHtml }}
      />
    </div>
  );
}
