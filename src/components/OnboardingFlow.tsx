import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, Heart } from 'lucide-react';

interface OnboardingFlowProps {
  userName: string;
  onComplete: (data: OnboardingData) => void;
  isDark?: boolean;
}

export interface OnboardingData {
  displayName: string;
  age: string;
  relationshipStatus: string;
  gender: string;
  preferredStyle: string;
}

const OnboardingFlow = ({ userName, onComplete, isDark = true }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    displayName: userName || '',
    age: '',
    relationshipStatus: '',
    gender: '',
    preferredStyle: ''
  });

  const handleComplete = () => {
    const completeData = {
      ...formData,
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    };
    onComplete(completeData);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (key: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const steps = [
    {
      title: "What should we call you?",
      content: (
        <div className="space-y-4">
          <Label htmlFor="displayName" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            Display Name
          </Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => updateFormData('displayName', e.target.value)}
            placeholder="How you'd like to be addressed"
            className={isDark 
              ? 'bg-slate-900/50 border-slate-700 text-slate-200' 
              : 'bg-white border-slate-300 text-slate-900'
            }
          />
        </div>
      ),
      isValid: () => formData.displayName.trim().length > 0
    },
    {
      title: "Tell us a bit about yourself",
      content: (
        <div className="space-y-6">
          <div>
            <Label htmlFor="age" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              Your age
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => updateFormData('age', e.target.value)}
              placeholder="Age"
              min="13"
              max="120"
              className={`mt-1 ${isDark 
                ? 'bg-slate-900/50 border-slate-700 text-slate-200' 
                : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          
          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              Relationship status
            </Label>
            <Select value={formData.relationshipStatus} onValueChange={(value) => updateFormData('relationshipStatus', value)}>
              <SelectTrigger className={`mt-1 ${isDark 
                ? 'bg-slate-900/50 border-slate-700 text-slate-200' 
                : 'bg-white border-slate-300 text-slate-900'
              }`}>
                <SelectValue placeholder="Select your relationship status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="in-relationship">In a relationship</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              Gender
            </Label>
            <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
              <SelectTrigger className={`mt-1 ${isDark 
                ? 'bg-slate-900/50 border-slate-700 text-slate-200' 
                : 'bg-white border-slate-300 text-slate-900'
              }`}>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
      isValid: () => formData.age && formData.relationshipStatus && formData.gender
    },
    {
      title: "Choose your preferred interpretation style",
      content: (
        <div className="space-y-4">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Select the style that resonates most with you:
          </p>
          <RadioGroup value={formData.preferredStyle} onValueChange={(value) => updateFormData('preferredStyle', value)}>
            <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
              formData.preferredStyle === 'psychological' 
                ? 'border-blue-500 bg-blue-500/10' 
                : isDark ? 'border-slate-700' : 'border-slate-300'
            }`}>
              <RadioGroupItem value="psychological" id="psychological" />
              <Label htmlFor="psychological" className={`flex-1 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <div className="font-medium">Psychological</div>
                <div className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  Focus on mind, emotions, and subconscious patterns
                </div>
              </Label>
            </div>
            
            <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
              formData.preferredStyle === 'islamic' 
                ? 'border-green-500 bg-green-500/10' 
                : isDark ? 'border-slate-700' : 'border-slate-300'
            }`}>
              <RadioGroupItem value="islamic" id="islamic" />
              <Label htmlFor="islamic" className={`flex-1 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <div className="font-medium">Islamic</div>
                <div className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  Based on religious sources and traditional interpretations
                </div>
              </Label>
            </div>
            
            <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
              formData.preferredStyle === 'spiritual' 
                ? 'border-purple-500 bg-purple-500/10' 
                : isDark ? 'border-slate-700' : 'border-slate-300'
            }`}>
              <RadioGroupItem value="spiritual" id="spiritual" />
              <Label htmlFor="spiritual" className={`flex-1 cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <div className="font-medium">Spiritual</div>
                <div className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  Symbolic and intuitive meanings from universal wisdom
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      ),
      isValid: () => formData.preferredStyle !== ''
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950' 
        : 'bg-gradient-to-br from-white via-purple-50/20 to-slate-50'
    }`}>
      <Card className={`w-full max-w-lg ${
        isDark 
          ? 'glass-card border-slate-800/50' 
          : 'bg-white/90 backdrop-blur-xl border-slate-200/50'
      }`}>
        <CardHeader className="text-center space-y-4">
          {currentStep === 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Great to have you here, {userName}!
              </CardTitle>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Let's make your dream interpretations more personal and meaningful
              </p>
            </div>
          )}
          
          {currentStep > 0 && (
            <CardTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {currentStepData.title}
            </CardTitle>
          )}
          
          <div className="flex space-x-2 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-purple-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStepData.content}
          
          {currentStep === steps.length - 1 && (
            <div className={`p-4 rounded-lg border ${
              isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Your privacy is important to us
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                This helps us make your dream interpretations more personalized and relevant. 
                You can always update this info later from your settings. Your answers are safe and secure.
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className={`flex-1 ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300'
                }`}
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!currentStepData.isValid()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
