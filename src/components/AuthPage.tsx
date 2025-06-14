import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Zap, Brain, Eye, EyeOff, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import ReferralWelcomeDialog from './ReferralWelcomeDialog';

interface AuthPageProps {
  isDark?: boolean;
  onThemeToggle?: () => void;
}

const AuthPage = ({ isDark = true, onThemeToggle }: AuthPageProps) => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [referrerName, setReferrerName] = useState<string>();
  const [referralCode, setReferralCode] = useState<string>();

  // Check for referral code when component mounts
  useEffect(() => {
    const checkReferral = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      
      console.log('Checking for referral code:', refCode);
      
      if (refCode) {
        console.log('Found referral code:', refCode);
        setReferralCode(refCode);
        
        // Find referrer based on the referral code
        const { data: referrerData } = await supabase
          .from('profiles')
          .select('display_name')
          .like('id', `${refCode}%`)
          .single();

        console.log('Referrer data:', referrerData);

        if (referrerData?.display_name) {
          console.log('Found referrer:', referrerData.display_name);
          setReferrerName(referrerData.display_name);
          setShowReferralDialog(true);
          setIsLogin(false); // Switch to signup mode
        } else {
          console.log('No referrer name found');
        }
      }
    };

    checkReferral();
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Welcome back!');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
              referralCode: referralCode // Store the referral code
            },
          },
        });
        if (error) throw error;

        // Create initial profile after signup
        if (data?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ 
              id: data.user.id,
              display_name: name || email.split('@')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.error('Error creating initial profile:', profileError);
          }
        }
        toast.success('Check your email to confirm your account!');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:8080',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error(error.message || 'Google authentication failed');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950' 
        : 'bg-gradient-to-br from-white via-purple-50/20 to-slate-50'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse ${
          isDark ? 'bg-purple-500/10' : 'bg-purple-500/20'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl animate-pulse delay-1000 ${
          isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/20'
        }`}></div>
        <div className={`absolute top-3/4 left-1/2 w-32 h-32 rounded-full blur-2xl animate-pulse delay-500 ${
          isDark ? 'bg-amber-500/10' : 'bg-amber-500/20'
        }`}></div>
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <Card className={`w-full max-w-md relative z-10 ${
        isDark 
          ? 'glass-card border-slate-800/50' 
          : 'bg-white/90 backdrop-blur-xl border-slate-200/50'
      }`}>
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center neon-glow">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Eye className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
            Ramel
          </CardTitle>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {isLogin ? t('auth.welcome') : t('auth.begin')}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Button
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading}
            className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin mr-2"></div>
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {t('auth.continueWithGoogle')}
          </Button>

          <div className="relative">
            <Separator className={isDark ? 'bg-slate-700' : 'bg-slate-200'} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`px-3 text-sm ${
                isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-600'
              }`}>
                {t('auth.or')}
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('auth.name')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className={`mt-1 ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500/20' 
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                {t('auth.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`mt-1 ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-purple-500 focus:ring-purple-500/20'
                }`}
              />
            </div>
            
            <div>
              <Label htmlFor="password" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                {t('auth.password')}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`mt-1 pr-10 ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-700 text-slate-200 focus:border-purple-500 focus:ring-purple-500/20' 
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-purple-500 focus:ring-purple-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${
                    isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-600'
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {!isLogin && <PasswordStrengthMeter password={password} />}
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {isLogin ? t('auth.login') : t('auth.signup')}
            </Button>
          </form>
          
          <div className="text-center">
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
                Terms of Service
              </a>{' '}
              apply.
            </p>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className={`text-sm ${
                isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              {isLogin ? t('auth.switchToSignup') : t('auth.switchToLogin')}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Welcome Dialog */}
      <ReferralWelcomeDialog 
        isOpen={showReferralDialog}
        referrerName={referrerName} 
        onClose={() => setShowReferralDialog(false)}
        isDark={isDark}
      />
    </div>
  );
};

export default AuthPage;
