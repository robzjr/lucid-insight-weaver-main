
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

interface AppPreferencesSectionProps {
  userPreferences: any;
  isDark?: boolean;
  onThemeToggle: () => void;
  onUpdatePreferences: (preferences: any) => void;
}

const AppPreferencesSection = ({ userPreferences, isDark = true, onThemeToggle, onUpdatePreferences }: AppPreferencesSectionProps) => {
  const handleLanguageChange = (language: string) => {
    onUpdatePreferences({
      language: language
    });
    toast.success(`Language changed to ${language === 'ar' ? 'Arabic' : 'English'}`);
  };

  return (
    <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
      <CardHeader>
        <CardTitle className={`${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          App Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="theme" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Dark Mode
            </Label>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Use dark theme across the app
            </p>
          </div>
          <Switch id="theme" checked={isDark} onCheckedChange={onThemeToggle} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Globe className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <Label htmlFor="language" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Language
              </Label>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Choose your preferred language
            </p>
          </div>
          <div className="w-32">
            <Select value={userPreferences?.language || 'en'} onValueChange={handleLanguageChange}>
              <SelectTrigger className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppPreferencesSection;
