import { AuthHeader } from '../AuthHeader';

export function ResetPasswordHeader() {
  return (
    <AuthHeader
      title="إعادة تعيين كلمة المرور"
      description="الرجاء إدخال رمز التحقق (OTP) المرسل إلى بريدك الإلكتروني، واختيار كلمة مرور جديدة قوية."
    />
  );
}
