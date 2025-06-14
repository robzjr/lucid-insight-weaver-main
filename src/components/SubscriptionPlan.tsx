
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Calendar, Infinity, Users, Zap, Star } from 'lucide-react';
import { useUserUsage } from '@/hooks/useUserUsage';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { toast } from 'sonner';

interface SubscriptionPlanProps {
  isDark?: boolean;
  onUpgrade: () => void;
}

const SubscriptionPlan = ({ isDark = true, onUpgrade }: SubscriptionPlanProps) => {
  const { usage, interpretationsLeft } = useUserUsage();
  const { generateReferralLink } = useReferralSystem();

  const handleReferFriend = () => {
    const referralLink = generateReferralLink();
    const referralText = `Check out Ramel - the AI-powered dream interpreter! Use my referral to get 5 free dream interpretations. Sign up here: ${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Ramel - Dream Interpreter',
        text: referralText,
      });
    } else {
      navigator.clipboard.writeText(referralText);
      toast.success('Referral link copied to clipboard!');
    }
  };

  const basicFeatures = [
    "5 dream interpretations per month",
    "Basic interpretation styles",
    "Save dreams to library",
    "Email support"
  ];

  const premiumFeatures = [
    "50 dream interpretations per month",
    "Advanced AI analysis",
    "All interpretation styles",
    "Dream pattern insights",
    "Priority support",
    "Export dream journal"
  ];

  const ultimateFeatures = [
    "Unlimited dream interpretations",
    "Advanced AI analysis with Gemini 2.5 Pro",
    "All interpretation styles + exclusive content",
    "Advanced dream pattern insights",
    "Personal dream coach",
    "Priority support",
    "Export dream journal",
    "Early access to new features",
    "Custom interpretation requests"
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Choose Your Plan
        </h1>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Unlock the full potential of your dream journey
        </p>
      </div>

      {/* Don't want to pay section */}
      <Card className={`${isDark ? 'glass-card border-blue-600/30 bg-blue-950/20' : 'bg-blue-50/90 border-blue-300'} mb-6`}>
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <h3 className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
              Don't want to pay right now? No problem!
            </h3>
            <p className={`text-sm ${isDark ? 'text-blue-400/80' : 'text-blue-700'}`}>
              Refer a friend and both of you will get 5 free interpretations
            </p>
            <Button
              onClick={handleReferFriend}
              className={`${isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Refer a Friend & Get 5 Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Basic Pack */}
        <Card className={`relative ${
          isDark ? 'glass-card border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <CardHeader>
            <CardTitle className={`text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Basic Pack
            </CardTitle>
            <div className="flex items-baseline space-x-1">
              <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Free
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-3 rounded-lg border border-green-500/30 ${
              isDark ? 'bg-green-950/20' : 'bg-green-50'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5 text-green-500" />
                <span className={`font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                  5 Interpretations/Month
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {basicFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className={`w-full ${
                isDark ? 'border-slate-600 text-slate-300' : 'border-slate-300'
              }`}
              disabled
            >
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Premium Pack */}
        <Card className={`relative border-2 border-purple-500 ${
          isDark ? 'glass-card' : 'bg-white'
        }`}>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          </div>
          
          <CardHeader className="pt-8">
            <CardTitle className={`text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Premium Pack
            </CardTitle>
            <div className="flex items-baseline space-x-1">
              <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                $9.99
              </span>
              <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                /month
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Or $99.99/year (save 17%)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-3 rounded-lg border border-purple-500/30 ${
              isDark ? 'bg-purple-950/20' : 'bg-purple-50'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <span className={`font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  50 Interpretations/Month
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Button 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>

        {/* Ultimate Pack */}
        <Card className={`relative border-2 border-yellow-500 ${
          isDark ? 'glass-card' : 'bg-white'
        }`}>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1">
              <Star className="h-3 w-3 mr-1" />
              Ultimate
            </Badge>
          </div>
          
          <CardHeader className="pt-8">
            <CardTitle className={`text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Ultimate Pack
            </CardTitle>
            <div className="flex items-baseline space-x-1">
              <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                $19.99
              </span>
              <span className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                /month
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Or $199.99/year (save 17%)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-3 rounded-lg border border-yellow-500/30 ${
              isDark ? 'bg-yellow-950/20' : 'bg-yellow-50'
            }`}>
              <div className="flex items-center justify-center space-x-2">
                <Infinity className="h-5 w-5 text-yellow-500" />
                <span className={`font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Unlimited Interpretations
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {ultimateFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Button 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold"
            >
              <Star className="h-4 w-4 mr-2" />
              Upgrade to Ultimate
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
