import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Edit } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ProfileSectionProps {
  userEmail: string;
  isDark?: boolean;
}

const ProfileSection = ({ userEmail, isDark = true }: ProfileSectionProps) => {
  const { profile, updateProfile, isUpdating } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: profile?.display_name || '',
    age: profile?.age?.toString() || '',
    relationshipStatus: profile?.relationship_status || '',
    gender: profile?.gender || '',
    preferredStyle: profile?.preferred_style || ''
  });

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        displayName: profile?.display_name || '',
        age: profile?.age?.toString() || '',
        relationshipStatus: profile?.relationship_status || '',
        gender: profile?.gender || '',
        preferredStyle: profile?.preferred_style || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    updateProfile({
      display_name: editForm.displayName,
      age: parseInt(editForm.age) || null,
      relationship_status: editForm.relationshipStatus,
      gender: editForm.gender,
      preferred_style: editForm.preferredStyle
    });
    setIsEditing(false);
  };

  return (
    <Card className={`${isDark ? 'glass-card border-slate-700' : 'bg-white/90 border-slate-200'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center justify-between ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleEditToggle} className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} h-8 w-8 p-0`}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {userEmail}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Display Name
              </Label>
              <Input 
                id="displayName" 
                value={editForm.displayName} 
                onChange={e => setEditForm({ ...editForm, displayName: e.target.value })} 
                placeholder="Enter your display name" 
                className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'} 
              />
            </div>

            <div>
              <Label htmlFor="age" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Age
              </Label>
              <Input 
                id="age" 
                type="number" 
                value={editForm.age} 
                onChange={e => setEditForm({ ...editForm, age: e.target.value })} 
                placeholder="Enter your age" 
                min="13" 
                max="120" 
                className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'} 
              />
            </div>

            <div>
              <Label htmlFor="relationshipStatus" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Relationship Status
              </Label>
              <Select value={editForm.relationshipStatus} onValueChange={value => setEditForm({ ...editForm, relationshipStatus: value })}>
                <SelectTrigger className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="in-relationship">In a relationship</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Gender
              </Label>
              <Select value={editForm.gender} onValueChange={value => setEditForm({ ...editForm, gender: value })}>
                <SelectTrigger className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preferredStyle" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Preferred Interpretation Style
              </Label>
              <Select value={editForm.preferredStyle} onValueChange={value => setEditForm({ ...editForm, preferredStyle: value })}>
                <SelectTrigger className={isDark ? 'bg-slate-900/50 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psychological">Psychological</SelectItem>
                  <SelectItem value="islamic">Islamic</SelectItem>
                  <SelectItem value="spiritual">Spiritual</SelectItem>
                  <SelectItem value="mixed">All styles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSaveProfile} disabled={isUpdating} className="bg-green-600 text-white">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleEditToggle} className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300'}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Display Name
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {profile?.display_name || 'Not set'}
              </p>
            </div>
            <div>
              <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Age
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {profile?.age || 'Not set'}
              </p>
            </div>
            <div>
              <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Relationship Status
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {profile?.relationship_status || 'Not set'}
              </p>
            </div>
            <div>
              <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Gender
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {profile?.gender || 'Not set'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
