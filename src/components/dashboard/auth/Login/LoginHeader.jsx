import { CardDescription, CardTitle } from '@/components/ui/card';

export function LoginHeader() {
  return (
    <div className="mb-8">
      <CardTitle className="text-3xl font-bold text-foreground mb-2">تسجيل الدخول</CardTitle>
      <CardDescription className="text-muted-foreground text-base leading-relaxed">
        سجّل الدخول للوصول إلى لوحة التحكم ومتابعة الموظفين والحضور والطلبات بكل سهولة.
      </CardDescription>
    </div>
  );
}
