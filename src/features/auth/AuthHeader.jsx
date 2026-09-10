import { CardDescription, CardTitle } from '@/components/ui/card';

/**
 * مكون Header مشترك لصفحات المصادقة
 * @param {Object} props
 * @param {string} props.title - عنوان الصفحة
 * @param {string} props.description - وصف الصفحة
 * @param {boolean} props.centered - هل النصوص في المنتصف؟
 * @param {React.ReactNode} props.extraContent - محتوى إضافي (مثل تغيير البريد)
 */
export function AuthHeader({ title, description, centered = false, extraContent }) {
  return (
    <div className={`mb-8 ${centered ? 'text-center' : ''}`}>
      <CardTitle className={`text-3xl font-bold text-foreground ${centered ? 'mb-5' : 'mb-2'}`}>
        {title}
      </CardTitle>
      <CardDescription className="text-muted-foreground text-base leading-relaxed">
        {description}
      </CardDescription>
      {extraContent && (
        <CardDescription className="text-muted-foreground text-base leading-relaxed mb-5">
          {extraContent}
        </CardDescription>
      )}
    </div>
  );
}
