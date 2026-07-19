import { Button } from '@/components/ui/button';

export function ResendButton({ countdown, onResend }) {
  return (
    <div className="text-center">
      <Button
        type="button"
        variant="ghost"
        onClick={onResend}
        disabled={countdown > 0}
        className="text-sm text-muted-foreground hover:text-primary"
      >
        {countdown > 0
          ? `يمكنك إعادة إرسال الكود خلال ${countdown}ث`
          : 'إعادة إرسال الكود'
        }
      </Button>
    </div>
  );
}
