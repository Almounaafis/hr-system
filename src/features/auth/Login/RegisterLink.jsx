export function RegisterLink() {
  return (
    <p className="text-center text-sm text-muted-foreground mt-6">
      ليس لديك حساب؟{' '}
      <a href="/register" className="text-primary font-semibold hover:text-primary/80">
        إنشاء حساب
      </a>
    </p>
  );
}
