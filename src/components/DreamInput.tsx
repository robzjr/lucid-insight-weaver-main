
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isAnalyzing: boolean;
  isDark?: boolean;
}

const DreamInput = ({ onSubmit, isAnalyzing, isDark = true }: DreamInputProps) => {
  const [dreamText, setDreamText] = useState('');
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 800);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isAnalyzing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamText.trim()) {
      onSubmit(dreamText.trim());
    }
  };

  const estimatedWaitTime = "30-60 seconds";

  return (
    <div className="max-w-md mx-auto p-4 slide-up">
      <Card className={`cyber-border fade-in-scale ${
        isDark 
          ? 'glass-card border-slate-800/50' 
          : 'bg-white/90 backdrop-blur-xl border-slate-200/50'
      }`}>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative floating-element">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full flex items-center justify-center glow-pulse">
                <div className="w-6 h-6 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
          <CardTitle className="hologram-text text-xl">
            Share Your Dream
          </CardTitle>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Describe your dream in detail for the most accurate interpretation
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="dream" className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Dream Description
              </Label>
              <Textarea
                id="dream"
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="I dreamed that I was walking through a forest when I saw a bright light ahead. I felt curious but also a little scared..."
                className={`mt-2 min-h-36 resize-none transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-white/50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20'
                }`}
                disabled={isAnalyzing}
              />
            </div>

            {isAnalyzing && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Analyzing your dream...
                  </span>
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className={`text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Estimated wait time: {estimatedWaitTime}
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              className={`w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 ${
                isAnalyzing ? 'pulse-glow' : ''
              }`}
              disabled={!dreamText.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Interpreting your dream...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                  <span>Interpret My Dream</span>
                </div>
              )}
            </Button>
          </form>
          
          <div className={`mt-6 text-xs text-center border-t pt-4 ${
            isDark 
              ? 'text-slate-500 border-slate-800' 
              : 'text-slate-400 border-slate-200'
          }`}>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Your dreams are private and secure</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DreamInput;
