
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
  isDark?: boolean;
}

const PasswordStrengthMeter = ({ password, isDark = true }: PasswordStrengthMeterProps) => {
  const calculateStrength = (password: string) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[A-Z]/.test(password)) {
      score += 25;
    } else {
      feedback.push("One uppercase letter");
    }

    if (/[a-z]/.test(password)) {
      score += 25;
    } else {
      feedback.push("One lowercase letter");
    }

    if (/[0-9]/.test(password)) {
      score += 25;
    } else {
      feedback.push("One number");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 10;
    }

    const strength = score <= 25 ? 'Weak' : score <= 50 ? 'Fair' : score <= 75 ? 'Good' : 'Strong';
    const color = score <= 25 ? 'bg-red-500' : score <= 50 ? 'bg-yellow-500' : score <= 75 ? 'bg-blue-500' : 'bg-green-500';

    return { score: Math.min(score, 100), strength, color, feedback };
  };

  if (!password) return null;

  const { score, strength, color, feedback } = calculateStrength(password);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Password strength:
        </span>
        <span className={`text-sm font-medium ${
          score <= 25 ? 'text-red-500' : 
          score <= 50 ? 'text-yellow-500' : 
          score <= 75 ? 'text-blue-500' : 
          'text-green-500'
        }`}>
          {strength}
        </span>
      </div>
      <Progress value={score} className="h-2" />
      {feedback.length > 0 && (
        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
          Missing: {feedback.join(', ')}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
