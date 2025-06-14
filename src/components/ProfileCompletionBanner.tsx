
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ProfileCompletionBannerProps {
  onComplete: () => void;
  isDark?: boolean;
}

const ProfileCompletionBanner = ({ onComplete, isDark = true }: ProfileCompletionBannerProps) => {
  return (
    <Card className={`${
      isDark 
        ? 'glass-card border-amber-600/30 bg-amber-950/20' 
        : 'bg-amber-50/90 border-amber-300'
    } mb-4 mx-4`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className={`h-5 w-5 flex-shrink-0 ${
            isDark ? 'text-amber-400' : 'text-amber-600'
          }`} />
          <div className="flex-1">
            <h3 className={`font-medium ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              Complete Your Profile
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-amber-400/80' : 'text-amber-700'
            }`}>
              Add your details to get more personalized and accurate dream interpretations
            </p>
          </div>
          <Button
            onClick={onComplete}
            size="sm"
            className={`${
              isDark 
                ? 'bg-amber-600 text-white hover:bg-amber-700' 
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            Complete
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionBanner;
