'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={compact ? "h-9 w-9 px-0" : "h-9 w-9"}>
        <Moon className="h-4 w-4" />
        <span className="sr-only">Đổi theme</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={compact ? "h-9 w-9 px-0" : "h-9 w-9"}
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Đổi theme</span>
    </Button>
  );
}
