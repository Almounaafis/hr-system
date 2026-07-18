import { GoogleIcon, FacebookIcon } from '@/components/dashboard/auth/Login/SocialIcons';

export function SocialLogin() {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL.replace('/api/', '')}/api/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL.replace('/api/', '')}/api/auth/facebook`;
  };

  return (
    <>
      <div className="flex items-center gap-3 my-6 px-5 md:px-20">
        <span className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground whitespace-nowrap">او سجل عبر</span>
        <span className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 h-11 rounded-xl border border-input bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <GoogleIcon />
          سجل من خلال جوجل
        </button>
        <button
          type="button"
          onClick={handleFacebookLogin}
          className="flex items-center justify-center gap-2 h-11 rounded-xl border border-input bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <FacebookIcon />
          سجل من خلال فيسبوك
        </button>
      </div>
    </>
  );
}
