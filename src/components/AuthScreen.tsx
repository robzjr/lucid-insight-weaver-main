import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Zap, Brain, Eye } from 'lucide-react';

interface AuthScreenProps {
  onAuth: (user: { email: string; name: string }) => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

const AuthScreen = ({ onAuth, isDark = true, onThemeToggle }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth({ email, name: name || 'Neural User' });
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
            DreamLens
          </CardTitle>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Neural interface for subconscious exploration</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className={isDark ? 'text-slate-300' : 'text-slate-700'}>Neural Identity</Label>
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
                  placeholder="Enter your identity"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className={isDark ? 'text-slate-300' : 'text-slate-700'}>Access Code</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`mt-1 ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20' 
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-cyan-500/20'
                }`}
                placeholder="neural@dreamlens.ai"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className={isDark ? 'text-slate-300' : 'text-slate-700'}>Neural Key</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`mt-1 ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-slate-200 focus:border-amber-500 focus:ring-amber-500/20' 
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-amber-500/20'
                }`}
                placeholder="Enter neural passkey"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:neon-glow"
            >
              <div className="flex items-center justify-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>{isLogin ? 'Interface Connection' : 'Initialize Neural Link'}</span>
              </div>
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className={`transition-colors ${
                isDark 
                  ? 'text-slate-400 hover:text-purple-400' 
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              {isLogin ? "Need neural access? Initialize new link" : "Already connected? Access interface"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
