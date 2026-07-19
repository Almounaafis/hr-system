import { CardDescription, CardTitle } from '@/components/ui/card';

export function RegisterHeader() {
  return (
    <div className="mb-8">
      <CardTitle className="text-3xl font-bold text-foreground mb-2">إنشاء حساب جديد</CardTitle>
      <CardDescription className="text-muted-foreground text-base leading-relaxed">
        أنشئ حسابك وابدأ إدارة شركتك بسهولة من خلال نظام بصمة.
      </CardDescription>
    </div>
  );
}
