import { CardDescription, CardTitle } from '@/components/ui/card';

export function VerifyHeader() {
  return (
    <div className="mb-8 text-center">
      <CardTitle className="text-3xl font-bold text-foreground mb-5">
        تحقق من بريدك الإلكتروني
      </CardTitle>
      <CardDescription className="text-muted-foreground text-base leading-relaxed mb-5">
        لقد أرسلنا رمز تحقق مكوّنًا من 6 أرقام إلى بريدك الإلكتروني. أدخل الرمز لإكمال  <br />  إنشاء حسابك وتفعيل الوصول إلى نظام بصمة.
      </CardDescription>
      <CardDescription className="text-muted-foreground text-base leading-relaxed mb-5">
        <span> info@company.com  </span>   <span className='text-primary'  > تغيير البريد الإلكتروني </span>
      </CardDescription>
    </div>
  );
}
