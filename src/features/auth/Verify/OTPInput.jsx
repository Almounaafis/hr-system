import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const OTP_LENGTH = 6;

export function OTPInput({ value, onChange, hasError }) {
  return (
    <div className="flex items-center justify-center gap-3 flex-row-reverse" dir="ltr">
      <InputOTP
        maxLength={OTP_LENGTH}
        value={value}
        onChange={(val) => {
          onChange(val);
        }}
        className="gap-3"
      >
        <InputOTPGroup className="gap-6">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={[
                'w-[60px] h-[60px] text-center text-xl font-bold rounded-md border bg-transparent',
                'transition-all duration-200 outline-none',
                'focus:ring-2 focus:ring-offset-2',
                hasError
                  ? 'border-destructive text-destructive focus:border-destructive focus:ring-destructive/30'
                  : value[index]
                    ? 'border-primary text-primary focus:border-primary focus:ring-primary/30'
                    : 'border-input text-foreground focus:border-primary focus:ring-primary/30',
              ].join(' ')}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
