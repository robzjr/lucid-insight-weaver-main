import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  display_name: string | null;
  age: number | null;
  relationship_status: string | null;
  gender: string | null;
  preferred_style: string | null;
  onboarding_completed: boolean | null;
  email: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as UserProfile;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!user) throw new Error('No user logged in');

      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking profile existence:', checkError);
        throw new Error(`Failed to check profile: ${checkError.message}`);
      }

      console.log('Profile update - Current profile:', existingProfile);
      console.log('Profile update - New data:', profileData);

      // If no profile exists, insert one
      if (!existingProfile) {
        const { data, error } = await supabase
          .from('profiles')
          .insert({ 
            id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...profileData 
          })
          .select()
          .single();
          
        if (error) {
          console.error('Profile insert error:', error);
          throw new Error(`Failed to create profile: ${error.message}`);
        }
        return data;
      }

      // Otherwise update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString(),
          ...profileData 
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('Profile updated successfully:', data);
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      
      // If this was the onboarding completion
      if (data.onboarding_completed) {
        // Reload the page to reflect all changes
        window.location.href = '/';
      }
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
    },
  });

  const updateProfile = (profileData: Partial<UserProfile>) => {
    updateProfileMutation.mutate(profileData);
  };

  const needsOnboarding = !profile?.onboarding_completed;

  return {
    profile,
    isLoading,
    updateProfile,
    needsOnboarding,
    isUpdating: updateProfileMutation.isPending
  };
};
