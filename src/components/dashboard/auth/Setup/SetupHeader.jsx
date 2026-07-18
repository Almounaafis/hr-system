import { CardDescription, CardTitle } from '@/components/ui/card';

export function SetupHeader() {
  return (
    <div className="mb-8">
      <CardTitle className="text-3xl font-bold text-foreground mb-2">إعداد الشركة</CardTitle>
      <CardDescription className="text-muted-foreground text-base leading-relaxed">
        أكمل إعداد شركتك من خلال إضافة الأقسام وفريق الموارد البشرية.
      </CardDescription>
    </div>
  );
}
