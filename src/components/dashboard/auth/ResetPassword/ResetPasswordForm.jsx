import { useForm, Controller } from 'react-hook-form';
import { PasswordInput } from '@/shared/forms/PasswordInput';
import { LoadingButton } from '@/shared/forms/LoadingButton';
import { OTPInput } from '@/components/dashboard/auth/Verify/OTPInput';

export function ResetPasswordForm({ onSubmit, loading, prefillEmail }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      otp: '',
      password: '',
      confirm_password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {prefillEmail && (
        <div className="bg-primary/10 text-primary border border-primary/20 rounded-xl p-4 text-center text-sm font-medium">
          تم إرسال رمز التحقق إلى: <span className="underline font-semibold">{prefillEmail}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground text-center">رمز التحقق (OTP)</label>
        <Controller
          name="otp"
          control={control}
          rules={{
            required: 'رمز التحقق مطلوب',
            minLength: { value: 6, message: 'رمز التحقق يجب أن يكون 6 أرقام' },
            maxLength: { value: 6, message: 'رمز التحقق يجب أن يكون 6 أرقام' },
          }}
          render={({ field: { onChange, value } }) => (
            <OTPInput
              value={value || ''}
              onChange={onChange}
              hasError={!!errors.otp}
            />
          )}
        />
        {errors.otp && (
          <p className="text-sm font-medium text-destructive text-center mt-2">
            {errors.otp.message}
          </p>
        )}
      </div>

      <PasswordInput
        name="password"
        label="كلمة المرور الجديدة"
        placeholder="ادخل كلمة المرور الجديدة"
        className="px-4 h-12 rounded-xl"
        error={errors.password?.message}
        register={register}
        rules={{
          required: 'كلمة المرور مطلوبة',
          minLength: { value: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        }}
      />

      <PasswordInput
        name="confirm_password"
        label="تأكيد كلمة المرور الجديدة"
        placeholder="أعد إدخال كلمة المرور الجديدة"
        className="px-4 h-12 rounded-xl"
        error={errors.confirm_password?.message}
        register={register}
        rules={{
          required: 'تأكيد كلمة المرور مطلوب',
          validate: (val) => {
            if (watch('password') !== val) {
              return 'كلمات المرور غير متطابقة';
            }
          },
        }}
      />

      <LoadingButton
        type="submit"
        className="w-full h-12 rounded-xl font-medium"
        loading={loading}
        loadingText="جاري إعادة التعيين..."
      >
        إعادة تعيين كلمة المرور
      </LoadingButton>

      <p className="text-center text-sm text-muted-foreground ">
        <a href="/login" className="text-primary font-semibold hover:text-primary/80">
          العودة لتسجيل الدخول
        </a>
      </p>
    </form>
  );
}
