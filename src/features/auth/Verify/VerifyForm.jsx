import { LoadingButton } from '@/components/shared/forms/LoadingButton';
import { OTPInput } from '@/features/auth/Verify/OTPInput';
import { ResendButton } from '@/features/auth/Verify/ResendButton';

export function VerifyForm({ otp, setOtp, error, setError, touched, loading, countdown, onResend, onSubmit }) {
  const hasError = touched && !!error;

  const handleOtpChange = (value) => {
    setOtp(value);
    if (error) setError('');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl mx-auto">
      <OTPInput value={otp} onChange={handleOtpChange} hasError={hasError} />

      {hasError && (
        <p className="text-sm font-medium text-destructive text-center mt-3">
          {error}
        </p>
      )}

      <LoadingButton
        type="submit"
        className="w-full h-12 rounded-xl font-medium"
        loading={loading}
        loadingText="جاري التحقق..."
      >
        تحقق
      </LoadingButton>

      <ResendButton countdown={countdown} onResend={onResend} />
    </form>
  );
}
