
import React from 'react';
import { Home, BookOpen, Settings, CreditCard } from 'lucide-react';

interface NavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  isDark?: boolean;
}

const Navigation = ({ activeScreen, onNavigate, isDark = true }: NavigationProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: BookOpen, label: 'Library' },
    { id: 'myplan', icon: CreditCard, label: 'My Plan' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 ${
      isDark 
        ? 'bg-slate-900/95 backdrop-blur-lg border-t border-slate-700' 
        : 'bg-white/95 backdrop-blur-lg border-t border-slate-200'
    }`}>
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? isDark
                    ? 'text-purple-400 bg-purple-500/10'
                    : 'text-purple-600 bg-purple-100'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'glow-pulse' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
