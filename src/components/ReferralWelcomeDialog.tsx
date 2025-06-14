import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, ArrowRight } from 'lucide-react';

interface ReferralWelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  referrerName?: string;
  isDark?: boolean;
}

const ReferralWelcomeDialog = ({
  isOpen,
  onClose,
  referrerName = 'your friend',
  isDark = true,
}: ReferralWelcomeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-slate-700 text-slate-200' 
          : 'bg-gradient-to-br from-white via-purple-50/20 to-white text-slate-900'
      }`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Gift className="h-6 w-6 text-purple-500" />
            <span>Special Gift Awaits!</span>
          </DialogTitle>
          <DialogDescription className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-base`}>
            {referrerName} has invited you to discover the hidden meanings of your dreams
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className={`p-6 rounded-lg ${
            isDark ? 'bg-purple-900/20 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className={`h-6 w-6 ${
                isDark ? 'text-purple-400' : 'text-purple-500'
              }`} />
              <span className={`text-lg font-medium ${
                isDark ? 'text-purple-300' : 'text-purple-700'
              }`}>
                Your Welcome Bonus
              </span>
            </div>
            <h3 className={`text-3xl font-bold mb-3 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>
              5 Free Dreams
            </h3>
            <p className={`text-base ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Sign up now through this special invitation and unlock 5 free dream interpretations instantly!
            </p>
          </div>

          <Button 
            onClick={onClose}
            className={`w-full h-12 text-lg font-semibold ${
              isDark 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-900/30' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-200/50'
            } text-white`}
          >
            <span>Create My Account</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralWelcomeDialog;
