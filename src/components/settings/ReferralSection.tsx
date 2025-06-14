import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Share2, Gift, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import ReferralConfirmationDialog from '@/components/ReferralConfirmationDialog';

interface ReferralSectionProps {
  userEmail: string;
  isDark?: boolean;
}

const ReferralSection = ({ userEmail, isDark = true }: ReferralSectionProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { generateReferralLink, referralCount, interpretationsRemaining } = useReferralSystem();
  const referralLink = generateReferralLink();

  const handleReferFriend = () => {
    setShowConfirmation(true);
  };

  const handleConfirmShare = () => {
    const referralText = `🌟 Unlock the secrets of your dreams with Ramel - the AI-powered dream interpreter! Join me and get 5 FREE dream interpretations using my referral link: ${referralLink} ✨`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Ramel - Dream Interpreter',
        text: referralText
      }).catch(() => {
        navigator.clipboard.writeText(referralText);
        toast.success('Referral link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(referralText);
      toast.success('Referral link copied to clipboard!');
    }
    setShowConfirmation(false);
  };

  return (
    <>
      <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <Users className="h-5 w-5" />
            <span>Refer Friends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-purple-50'}`}>
                <div className="flex items-center space-x-2">
                  <Gift className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Friends Referred
                  </span>
                </div>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {referralCount}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-purple-50'}`}>
                <div className="flex items-center space-x-2">
                  <Sparkles className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Free Credits Left
                  </span>
                </div>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {interpretationsRemaining}
                </p>
              </div>
            </div>

            {/* Referral Info */}
            <div className={`space-y-4 p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-purple-50'}`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Share Ramel with friends and you both get <span className="font-semibold">5 free dream interpretations!</span> 
                The more friends you refer, the more dreams you can interpret. 🌟
              </p>
              <div className="space-y-2">
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  • Your friend gets 5 free interpretations
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  • You get 5 interpretations for each referral
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  • No limit on how many friends you can refer!
                </p>
              </div>
            </div>

            <Button 
              onClick={handleReferFriend} 
              className={`w-full ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
              } text-white font-semibold`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share with Friends
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReferralConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmShare}
        referralLink={referralLink}
        isDark={isDark}
      />
    </>
  );
};

export default ReferralSection;
