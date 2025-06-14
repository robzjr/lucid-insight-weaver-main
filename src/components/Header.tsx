import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';
interface HeaderProps {
  title: string;
  onSettingsClick: () => void;
  onProfileClick: () => void;
  isDark?: boolean;
}
const Header = ({
  title,
  onSettingsClick,
  onProfileClick,
  isDark = true
}: HeaderProps) => {
  return <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl matrix-grid slide-up">
      
    </header>;
};
export default Header;