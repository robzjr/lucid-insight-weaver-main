
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings as SettingsIcon, HelpCircle } from 'lucide-react';

interface PreferencesSectionProps {
  userPreferences: any;
  onUpdatePreferences: (preferences: any) => void;
  isDark?: boolean;
}

const PreferencesSection = ({ userPreferences, onUpdatePreferences, isDark = true }: PreferencesSectionProps) => {
  const handleToggleChange = (key: string, value: boolean) => {
    onUpdatePreferences({
      [key]: value
    });
  };

  return (
    <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          <SettingsIcon className="h-5 w-5" />
          <span>Interpretation Preferences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="islamic" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Islamic Interpretation
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Based on traditional Islamic dream interpretation methods and teachings</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch 
            id="islamic" 
            checked={userPreferences?.showIslamic ?? true} 
            onCheckedChange={checked => handleToggleChange('showIslamic', checked)} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="spiritual" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Spiritual Interpretation
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Focuses on symbolic meanings, intuitive insights, and spiritual growth</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch 
            id="spiritual" 
            checked={userPreferences?.showSpiritual ?? true} 
            onCheckedChange={checked => handleToggleChange('showSpiritual', checked)} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="psychological" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Psychological Interpretation
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Based on modern psychology, Freudian and Jungian dream analysis</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch 
            id="psychological" 
            checked={userPreferences?.showPsychological ?? true} 
            onCheckedChange={checked => handleToggleChange('showPsychological', checked)} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesSection;
