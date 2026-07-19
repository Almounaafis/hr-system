import { useForm } from 'react-hook-form';
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from '@/components/shared/forms/FormInput';
import { PasswordInput } from '@/components/shared/forms/PasswordInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';

export default function AccountSetupStep({ onSubmit, loading, email, token }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email,
      token,
      phone: '',
      name: '',
      password: '',
      confirm_password: '',
      // agreed: false,
    },
  });

  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-3 duration-300">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
        أكمل بيانات حسابك
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 sm:mb-8">
        يرجى إدخال بياناتك لتفعيل حسابك والوصول إلى لوحة التحكم.
      </p>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <FormInput
  name="phone"
  label="رقم الجوال"
  type="tel"
  placeholder="01XXXXXXXXX"
  className="px-4 h-12 rounded-xl"
  error={errors.phone?.message}
  register={register}
  rules={{
    required: 'رقم الجوال مطلوب',
    pattern: {
      value: /^01[0125]\d{8}$/,
              message: 'رقم الجوال غير صالح',
    },
  }}
/>

        {/* Name Field */}
        <FormInput
          name="name"
          label="الاسم الكامل"
          type="text"
          placeholder="محمد أحمد"
          className="px-4 h-12 rounded-xl"
          error={errors.name?.message}
          register={register}
          rules={{
            required: 'الاسم مطلوب',
          }}
        />

        {/* Password Field */}

        <PasswordInput
          name="password"
          label="كلمة المرور"
          placeholder="ادخل كلمة المرور"
          className="px-4 h-12 rounded-xl"
          error={errors.password?.message}
          register={register}
          rules={{
            required: 'كلمة المرور مطلوبة',
            minLength: { value: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
          }}
        />

        {/* Confirm Password Field */}
        <PasswordInput
          name="confirm_password"
          label="تأكيد كلمة المرور"
          placeholder="••••••••"
          className="px-4 h-12 rounded-xl"
          error={errors.confirm_password?.message}
          register={register}
          rules={{
            required: 'تأكيد كلمة المرور مطلوب',
            validate: (value) => value === password || 'كلمات المرور غير متطابقة',
          }}
        />
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg mb-4 sm:mb-6 border border-border/30">
        <Checkbox
          checked={watch('agreed')}
          onCheckedChange={(checked) => setValue('agreed', checked)}
          className="accent-primary mt-0.5 sm:mt-1 flex-shrink-0"
        />
        <span className="text-[11px] sm:text-xs text-foreground leading-relaxed">
          أوافق على <span className="font-semibold">الشروط والأحكام</span> و<span className="font-semibold">سياسة الخصوصية</span>
        </span>
      </div>
      {errors.agreed && (
        <p className="text-[11px] sm:text-xs text-destructive text-right mb-3 sm:mb-4 animate-in fade-in">{errors.agreed.message}</p>
      )}

      {/* Activate Button */}
      <LoadingButton
        type="submit"
        className="w-full h-12 rounded-xl font-medium"
        loading={loading}
        loadingText="جاري تفعيل الحساب..."
      >
        تفعيل الحساب
      </LoadingButton>
    </form>
  );
}
