
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

interface AccountActionsSectionProps {
  onLogout: () => void;
  isDark?: boolean;
}

const AccountActionsSection = ({ onLogout, isDark = true }: AccountActionsSectionProps) => {
  return (
    <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
      <CardContent className="pt-6">
        <Button onClick={onLogout} variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountActionsSection;
