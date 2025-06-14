import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    console.log('Current language:', language);
    const newLanguage = language === 'en' ? 'ar' : 'en';
    console.log('Switching to language:', newLanguage);
    setLanguage(newLanguage);
  };

  console.log('LanguageSwitcher rendered with language:', language);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative"
      title={language === 'en' ? t('settings.arabic') : t('settings.english')}
    >
      <Globe className="h-5 w-5" />
      <span className="absolute -bottom-1 -right-1 text-xs font-bold">
        {language === 'en' ? 'عربي' : 'EN'}
      </span>
    </Button>
  );
}; 