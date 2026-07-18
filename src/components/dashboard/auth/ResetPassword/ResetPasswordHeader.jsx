import { CardDescription, CardTitle } from '@/components/ui/card';

export function ResetPasswordHeader() {
  return (
    <div className="mb-8">
      <CardTitle className="text-3xl font-bold text-foreground mb-2">إعادة تعيين كلمة المرور</CardTitle>
      <CardDescription className="text-muted-foreground text-base leading-relaxed">
        الرجاء إدخال رمز التحقق (OTP) المرسل إلى بريدك الإلكتروني، واختيار كلمة مرور جديدة قوية.
      </CardDescription>
    </div>
  );
}
