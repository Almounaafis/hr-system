import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 text-center overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] rounded-full bg-blue-100/40 blur-2xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[150px] h-[150px] rounded-full bg-purple-100/30 blur-2xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-lg">

        {/* Animated 404 number */}
        <div className="relative mb-6 select-none">
          <span
            className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent"
            style={{
              WebkitTextStroke: '2px hsl(var(--border))',
              letterSpacing: '-0.05em',
            }}
          >
            404
          </span>
          {/* Floating icon in the center of the zero */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background border border-border rounded-2xl p-4 shadow-lg">
              <Search className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-3 mb-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            هذه الصفحة غير موجودة
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-sm">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نعيد توجيهك.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button asChild size="lg" className="rounded-xl gap-2 px-6">
            <Link to="/">
              <Home className="h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-xl gap-2 px-6"
            onClick={() => window.history.back()}
          >
            <button type="button" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              العودة
            </button>
          </Button>
        </div>

        {/* Help text */}
        <p className="mt-8 text-xs text-muted-foreground">
          رمز الخطأ: <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">404</span>
          {' · '}
          إذا كنت تعتقد أن هذا خطأ،{' '}
          <Link to="/support" className="underline underline-offset-2 hover:text-foreground transition-colors">
            تواصل مع الدعم
          </Link>
        </p>
      </div>
    </div>
  );
}