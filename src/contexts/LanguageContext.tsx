import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    'auth.welcome': 'Welcome to your dream journey',
    'auth.begin': 'Begin your dream interpretation journey',
    'auth.or': 'or',
    'auth.continueWithGoogle': 'Continue with Google',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.switchToSignup': "Don't have an account? Sign up",
    'auth.switchToLogin': 'Already have an account? Login',
    'auth.welcomeBack': 'Welcome back!',
    'auth.accountCreated': 'Account created successfully!',
    'auth.authFailed': 'Authentication failed',

    // Navigation
    'nav.home': 'Home',
    'nav.history': 'History',
    'nav.settings': 'Settings',
    'nav.subscription': 'Subscription',
    'nav.help': 'Help',
    'nav.myPlan': 'My Plan',

    // Dream Input
    'dream.enter': 'Enter your dream...',
    'dream.interpret': 'Interpret Dream',
    'dream.saving': 'Saving...',
    'dream.save': 'Save Dream',
    'dream.new': 'New Dream',

    // Interpretations
    'interpret.islamic': 'Islamic',
    'interpret.spiritual': 'Spiritual',
    'interpret.psychological': 'Psychological',
    'interpret.noInterpretation': 'No interpretation available.',

    // Settings
    'settings.title': 'Profile & Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.dark': 'Dark',
    'settings.light': 'Light',
    'settings.english': 'English',
    'settings.arabic': 'Arabic',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
  },
  ar: {
    // Auth
    'auth.welcome': 'مرحباً بك في رحلة أحلامك',
    'auth.begin': 'ابدأ رحلة تفسير أحلامك',
    'auth.or': 'أو',
    'auth.continueWithGoogle': 'المتابعة باستخدام جوجل',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم',
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.switchToSignup': 'ليس لديك حساب؟ سجل الآن',
    'auth.switchToLogin': 'لديك حساب بالفعل؟ سجل دخولك',
    'auth.welcomeBack': 'مرحباً بعودتك!',
    'auth.accountCreated': 'تم إنشاء الحساب بنجاح!',
    'auth.authFailed': 'فشل في المصادقة',

    // Navigation
    'nav.home': 'الرئيسية',
    'nav.history': 'السجل',
    'nav.settings': 'الإعدادات',
    'nav.subscription': 'الاشتراك',
    'nav.help': 'المساعدة',
    'nav.myPlan': 'خطتي',

    // Dream Input
    'dream.enter': 'أدخل حلمك...',
    'dream.interpret': 'تفسير الحلم',
    'dream.saving': 'جاري الحفظ...',
    'dream.save': 'حفظ الحلم',
    'dream.new': 'حلم جديد',

    // Interpretations
    'interpret.islamic': 'تفسير إسلامي',
    'interpret.spiritual': 'تفسير روحي',
    'interpret.psychological': 'تفسير نفسي',
    'interpret.noInterpretation': 'لا يوجد تفسير متاح.',

    // Settings
    'settings.title': 'الملف الشخصي والإعدادات',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'settings.dark': 'داكن',
    'settings.light': 'فاتح',
    'settings.english': 'الإنجليزية',
    'settings.arabic': 'العربية',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'تم بنجاح',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage, default to 'en'
    const savedLang = localStorage.getItem('language') as Language;
    console.log('Initial language from localStorage:', savedLang);
    return savedLang || 'en';
  });

  useEffect(() => {
    console.log('Language changed to:', language);
    // Save language preference to localStorage
    localStorage.setItem('language', language);
    // Update document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    // Update document language
    document.documentElement.lang = language;
    // Add language class to body for RTL support
    document.body.classList.remove('ltr', 'rtl');
    document.body.classList.add(language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    console.log(`Translation for "${key}":`, translation);
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 