import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';

interface UsageDisplayProps {
  interpretationsLeft: number;
  isDark?: boolean;
}

const UsageDisplay = ({ interpretationsLeft, isDark = true }: UsageDisplayProps) => {
  const isFreeUser = interpretationsLeft <= 5;

  return (
    <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'} mb-4 mx-4`}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          {isFreeUser ? (
            <Sparkles className={`w-6 h-6 text-blue-400`} />
          ) : (
            <Zap className={`w-6 h-6 text-yellow-400`} />
          )}
          <div>
            <div className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {isFreeUser ? 'Free User' : 'Premium User'}
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isFreeUser
                ? `${interpretationsLeft} interpretations left`
                : '100 interpretations per month'}
            </div>
          </div>
        </div>
        <Badge
          variant={isFreeUser ? 'secondary' : 'default'}
          className={
            isFreeUser
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              : 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
          }
        >
          {isFreeUser ? 'Basic Pack' : 'Premium Pack'}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default UsageDisplay;
