import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useThemeStore from '@/store/useThemeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
