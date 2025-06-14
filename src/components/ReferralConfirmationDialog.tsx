import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, Gift, Share2, Copy, Twitter, Facebook, MessageCircle } from 'lucide-react';

interface ReferralConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  referralLink: string;
  isDark?: boolean;
}

const ReferralConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  referralLink,
  isDark = true
}: ReferralConfirmationDialogProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    onClose();
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const text = encodeURIComponent('🌟 Unlock the secrets of your dreams with Ramel - the AI-powered dream interpreter! Join me and get 5 FREE dream interpretations using my referral link!');
    const url = encodeURIComponent(referralLink);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
        <DialogHeader>
          <DialogTitle className={`text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Share Ramel with Friends
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Your friends will love exploring their dreams with Ramel!
            </p>
            <div className={`flex items-center justify-center space-x-2 mt-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              <Gift className="h-5 w-5" />
              <span className="font-medium">You both get 5 free interpretations!</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-4">
          {/* Share buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className={`flex flex-col items-center space-y-1 h-auto py-4 ${
                isDark ? 'hover:bg-slate-800 border-slate-700' : 'hover:bg-slate-50'
              }`}
              onClick={() => handleSocialShare('twitter')}
            >
              <Twitter className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              variant="outline"
              className={`flex flex-col items-center space-y-1 h-auto py-4 ${
                isDark ? 'hover:bg-slate-800 border-slate-700' : 'hover:bg-slate-50'
              }`}
              onClick={() => handleSocialShare('facebook')}
            >
              <Facebook className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className={`flex flex-col items-center space-y-1 h-auto py-4 ${
                isDark ? 'hover:bg-slate-800 border-slate-700' : 'hover:bg-slate-50'
              }`}
              onClick={() => handleSocialShare('whatsapp')}
            >
              <MessageCircle className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
              <span className="text-xs">WhatsApp</span>
            </Button>
          </div>

          {/* Or divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-2 ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'}`}>
                Or share via
              </span>
            </div>
          </div>

          {/* Share link */}
          <div className="flex space-x-2">
            <Button
              className={`flex-1 ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
              } text-white`}
              onClick={onConfirm}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
            <Button
              variant="outline"
              className={`${isDark ? 'border-slate-700 hover:bg-slate-800' : 'hover:bg-slate-50'}`}
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralConfirmationDialog;