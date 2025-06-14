
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <Button
      onClick={onToggle}
      variant="ghost"
      size="icon"
      className="relative overflow-hidden group"
    >
      <div className={`transition-all duration-300 ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}>
        <Moon className="h-4 w-4 text-slate-50" />
      </div>
      <div className={`absolute transition-all duration-300 ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`}>
        <Sun className="h-4 w-4 text-amber-500" />
      </div>
    </Button>
  );
};

export default ThemeToggle;
