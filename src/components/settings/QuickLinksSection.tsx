
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Shield } from 'lucide-react';

interface QuickLinksSectionProps {
  onNavigateToHelp: () => void;
  isDark?: boolean;
}

const QuickLinksSection = ({ onNavigateToHelp, isDark = true }: QuickLinksSectionProps) => {
  return (
    <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
      <CardHeader>
        <CardTitle className={`${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="ghost" 
          onClick={onNavigateToHelp} 
          className={`w-full justify-start ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          <HelpCircle className="w-4 h-4 mr-3" />
          Help & Support
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => window.open('/privacy-policy', '_blank')} 
          className={`w-full justify-start ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          <Shield className="w-4 h-4 mr-3" />
          Privacy Policy
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickLinksSection;
