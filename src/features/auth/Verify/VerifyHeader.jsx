import { AuthHeader } from '../AuthHeader';

export function VerifyHeader() {
  return (
    <AuthHeader
      centered
      title="تحقق من بريدك الإلكتروني"
      description="لقد أرسلنا رمز تحقق مكوّنًا من 6 أرقام إلى بريدك الإلكتروني. أدخل الرمز لإكمال إنشاء حسابك وتفعيل الوصول إلى نظام بصمة."
      extraContent={
        <>
          <span> info@company.com </span>{' '}
          <span className="text-primary"> تغيير البريد الإلكتروني </span>
        </>
      }
    />
  );
}
