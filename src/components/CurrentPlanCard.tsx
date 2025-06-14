import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Sparkles } from 'lucide-react';
interface CurrentPlanCardProps {
  interpretationsLeft: number;
  onUpgrade: () => void;
  onViewPlans: () => void;
  isDark?: boolean;
}
const CurrentPlanCard = ({
  interpretationsLeft,
  onUpgrade,
  onViewPlans,
  isDark = true
}: CurrentPlanCardProps) => {
  const isFreeUser = interpretationsLeft <= 5;
  return <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'} mb-4 mx-4`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg flex items-center space-x-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {isFreeUser ? <Sparkles className="h-5 w-5 text-blue-400" /> : <Crown className="h-5 w-5 text-purple-400" />}
            <span>Current Plan</span>
          </CardTitle>
          <Badge variant={isFreeUser ? 'secondary' : 'default'} className={isFreeUser ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}>
            {isFreeUser ? 'Free Plan' : 'Premium Plan'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isFreeUser ? 'Free Interpretations' : 'Premium Benefits'}
            </span>
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isFreeUser ? `${interpretationsLeft} left` : 'Unlimited'}
            </span>
          </div>
          
          {isFreeUser && <div className={`w-full rounded-full h-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div className={`h-2 rounded-full transition-all duration-300 ${interpretationsLeft > 2 ? 'bg-green-500' : interpretationsLeft > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
            width: `${Math.max(0, Math.min(100, interpretationsLeft / 5 * 100))}%`
          }}></div>
            </div>}
        </div>

        {isFreeUser && <div className="space-y-2">
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Unlock unlimited interpretations and advanced features with Premium
            </p>
            <div className="flex space-x-2">
              <Button onClick={onUpgrade} className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white" size="sm">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
              
            </div>
          </div>}
      </CardContent>
    </Card>;
};
export default CurrentPlanCard;