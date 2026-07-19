import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/shared/forms/FormInput';
import { PasswordInput } from '@/components/shared/forms/PasswordInput';
import { LoadingButton } from '@/components/shared/forms/LoadingButton';

export function LoginForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
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

      <div className="text-left -mt-2">
        <a href="/forgot-password" className="text-sm text-primary font-semibold hover:text-primary/80">
          نسيت كلمة المرور؟
        </a>
      </div>

      <LoadingButton
        type="submit"
        className="w-full h-12 rounded-xl font-medium"
        loading={loading}
        loadingText="جاري تسجيل الدخول..."
      >
        تسجيل الدخول
      </LoadingButton>
    </form>
  );
}