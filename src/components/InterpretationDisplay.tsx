
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Book, User, Calendar } from 'lucide-react';

interface Interpretation {
  type: 'islamic' | 'spiritual' | 'psychological';
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}

interface InterpretationDisplayProps {
  dreamText: string;
  interpretations: Interpretation[];
  userPreferences: {
    showIslamic: boolean;
    showSpiritual: boolean;
    showPsychological: boolean;
  };
  onToggleVisibility: (type: string, visible: boolean) => void;
  onSaveDream: () => void;
  onNewDream: () => void;
  isDark?: boolean;
}

const InterpretationDisplay = ({
  dreamText,
  interpretations,
  userPreferences,
  onToggleVisibility,
  onSaveDream,
  onNewDream,
  isDark = true
}: InterpretationDisplayProps) => {
  // Get the first visible interpretation as the default active tab
  const getFirstVisibleType = () => {
    if (userPreferences.showIslamic) return 'islamic';
    if (userPreferences.showSpiritual) return 'spiritual';
    if (userPreferences.showPsychological) return 'psychological';
    return 'islamic'; // fallback
  };

  const [activeTab, setActiveTab] = useState<string>(getFirstVisibleType());

  // Filter interpretations based on user preferences
  const visibleInterpretations = interpretations.filter(interp => {
    switch (interp.type) {
      case 'islamic':
        return userPreferences.showIslamic;
      case 'spiritual':
        return userPreferences.showSpiritual;
      case 'psychological':
        return userPreferences.showPsychological;
      default:
        return true;
    }
  });

  // Update active tab when preferences change
  React.useEffect(() => {
    if (visibleInterpretations.length > 0 && !visibleInterpretations.find(i => i.type === activeTab)) {
      setActiveTab(visibleInterpretations[0].type);
    }
  }, [userPreferences, visibleInterpretations, activeTab]);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 slide-up">
      {/* Dream Summary */}
      <Card className={`${isDark ? 'glass-card' : 'bg-white border-slate-200'} fade-in-scale cyber-border`}>
        <CardHeader>
          <CardTitle className={`text-sm font-bold ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
            Your Dream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${isDark ? 'text-slate-50' : 'text-slate-700'}`}>
            {dreamText}
          </p>
        </CardContent>
      </Card>

      {/* Visibility Controls */}
      <Card className={`${isDark ? 'glass-card' : 'bg-white border-slate-200'} fade-in-scale cyber-border`}>
        <CardHeader>
          <CardTitle className={`text-sm hologram-text ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Choose Your Perspective
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="islamic-toggle" className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
              Islamic Interpretation
            </Label>
            <Switch 
              id="islamic-toggle" 
              checked={userPreferences.showIslamic} 
              onCheckedChange={checked => onToggleVisibility('islamic', checked)} 
              className="transition-all duration-300"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="spiritual-toggle" className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
              Spiritual Perspective
            </Label>
            <Switch 
              id="spiritual-toggle" 
              checked={userPreferences.showSpiritual} 
              onCheckedChange={checked => onToggleVisibility('spiritual', checked)} 
              className="transition-all duration-300"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="psychological-toggle" className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>
              Psychological Analysis
            </Label>
            <Switch 
              id="psychological-toggle" 
              checked={userPreferences.showPsychological} 
              onCheckedChange={checked => onToggleVisibility('psychological', checked)} 
              className="transition-all duration-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Interpretation Tabs */}
      {visibleInterpretations.length > 0 && (
        <>
          <div className={`flex space-x-1 p-1 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} fade-in-scale`}>
            {visibleInterpretations.map(interp => (
              <button
                key={interp.type}
                onClick={() => setActiveTab(interp.type)}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeTab === interp.type 
                    ? `${interp.color} text-white neon-glow` 
                    : isDark 
                      ? 'text-slate-300 hover:bg-slate-700/50' 
                      : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  {interp.icon}
                  <span>{interp.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Interpretation */}
          {visibleInterpretations.map(interp => 
            activeTab === interp.type && (
              <Card 
                key={interp.type} 
                className={`border-l-4 fade-in-scale cyber-border ${
                  isDark ? 'glass-card' : 'bg-white border-slate-200'
                }`}
                style={{ borderLeftColor: interp.color.replace('bg-', '#') }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {interp.icon}
                    <CardTitle className={`text-lg hologram-text ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {interp.title} Perspective
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`leading-relaxed ${isDark ? 'text-slate-50' : 'text-slate-700'}`}>
                    {interp.content}
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </>
      )}

      {visibleInterpretations.length === 0 && (
        <Card className={`${isDark ? 'glass-card' : 'bg-white border-slate-200'} fade-in-scale`}>
          <CardContent className="text-center py-8">
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              No interpretations are currently visible. Choose at least one perspective above to see your dream analysis.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 fade-in-scale">
        <Button 
          onClick={onSaveDream} 
          className={`flex-1 transition-all duration-300 transform hover:scale-105 hover:neon-glow ${
            isDark 
              ? 'bg-slate-800 hover:bg-slate-700 text-white' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          Save to My Library
        </Button>
        <Button 
          onClick={onNewDream} 
          variant="outline" 
          className={`flex-1 transition-all duration-300 transform hover:scale-105 ${
            isDark 
              ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:neon-glow' 
              : 'border-purple-600 text-purple-600 hover:bg-purple-50'
          }`}
        >
          New Dream
        </Button>
      </div>
    </div>
  );
};

export default InterpretationDisplay;
