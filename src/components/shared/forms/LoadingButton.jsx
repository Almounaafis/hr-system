import { Button } from '@/components/ui/button';

export function LoadingButton({
  loading,
  loadingText,
  children,
  className,
  ...props
}) {
  return (
    <Button
      disabled={loading}
      className={className}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
