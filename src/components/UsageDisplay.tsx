import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';
interface UsageDisplayProps {
  interpretationsLeft: number;
  isDark?: boolean;
}
const UsageDisplay = ({
  interpretationsLeft,
  isDark = true
}: UsageDisplayProps) => {
  const isFreeUser = interpretationsLeft <= 5;
  return <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'} mb-4`}>
      
    </Card>;
};
export default UsageDisplay;