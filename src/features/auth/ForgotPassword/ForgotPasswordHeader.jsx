import { AuthHeader } from '../AuthHeader';

export function ForgotPasswordHeader() {
  return (
    <AuthHeader
      title="استعادة كلمة المرور"
      description="أدخل بريدك الإلكتروني لإرسال رمز التحقق (OTP) لإعادة تعيين كلمة المرور الخاصة بك."
    />
  );
}
