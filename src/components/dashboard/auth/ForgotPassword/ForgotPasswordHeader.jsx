import { CardDescription, CardTitle } from '@/components/ui/card';

export function ForgotPasswordHeader() {
  return (
    <div className="mb-8">
      <CardTitle className="text-3xl font-bold text-foreground mb-2">استعادة كلمة المرور</CardTitle>
      <CardDescription className="text-muted-foreground text-base leading-relaxed">
        أدخل بريدك الإلكتروني لإرسال رمز التحقق (OTP) لإعادة تعيين كلمة المرور الخاصة بك.
      </CardDescription>
    </div>
  );
}
