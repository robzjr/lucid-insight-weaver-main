
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import ProfileSection from '@/components/settings/ProfileSection';
import SecuritySection from '@/components/settings/SecuritySection';
import PreferencesSection from '@/components/settings/PreferencesSection';
import QuickLinksSection from '@/components/settings/QuickLinksSection';
import ReferralSection from '@/components/settings/ReferralSection';
import AppPreferencesSection from '@/components/settings/AppPreferencesSection';
import AccountActionsSection from '@/components/settings/AccountActionsSection';

interface SettingsProps {
  userPreferences: any;
  onUpdatePreferences: (preferences: any) => void;
  onLogout: () => void;
  userEmail: string;
  isDark?: boolean;
  onThemeToggle: () => void;
  onUpgrade: () => void;
  onNavigateToSubscription: () => void;
  onNavigateToHelp: () => void;
}

const Settings = ({
  userPreferences,
  onUpdatePreferences,
  onLogout,
  userEmail,
  isDark = true,
  onThemeToggle,
  onUpgrade,
  onNavigateToSubscription,
  onNavigateToHelp
}: SettingsProps) => {
  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 max-w-2xl space-y-6">
        <ProfileSection userEmail={userEmail} isDark={isDark} />
        <QuickLinksSection onNavigateToHelp={onNavigateToHelp} isDark={isDark} />
        <ReferralSection userEmail={userEmail} isDark={isDark} />
        <SecuritySection isDark={isDark} />
        <PreferencesSection 
          userPreferences={userPreferences} 
          onUpdatePreferences={onUpdatePreferences} 
          isDark={isDark} 
        />
        <AppPreferencesSection 
          userPreferences={userPreferences} 
          isDark={isDark} 
          onThemeToggle={onThemeToggle} 
          onUpdatePreferences={onUpdatePreferences} 
        />
        <AccountActionsSection onLogout={onLogout} isDark={isDark} />
      </div>
    </TooltipProvider>
  );
};

export default Settings;
