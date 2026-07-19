import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/shared/forms/FormInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';

export function ForgotPasswordForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormInput
        name="email"
        label="البريد الالكتروني"
        type="email"
        placeholder="ادخل بريدك الالكتروني"
        className="px-4 h-12 rounded-xl"
        error={errors.email?.message}
        register={register}
        rules={{
          required: 'البريد الإلكتروني مطلوب',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'البريد الإلكتروني غير صالح',
          },
        }}
      />

      <LoadingButton
        type="submit"
        className="w-full h-12 rounded-xl font-medium"
        loading={loading}
        loadingText="جاري الإرسال..."
      >
        إرسال رمز التحقق
      </LoadingButton>

      <p className="text-center text-sm text-muted-foreground ">
        تذكرت كلمة المرور؟{' '}
        <a href="/login" className="text-primary font-semibold hover:text-primary/80">
          تسجيل الدخول
        </a>
      </p>
    </form>
  );
}
