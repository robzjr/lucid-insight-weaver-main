
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserPreferences {
  showIslamic: boolean;
  showSpiritual: boolean;
  showPsychological: boolean;
  theme: string;
  language: string;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['userPreferences', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create default preferences if none exist
        const defaultPrefs = {
          user_id: user.id,
          show_islamic: true,
          show_spiritual: true,
          show_psychological: true,
          theme: 'dark',
          language: 'en'
        };

        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .insert(defaultPrefs)
          .select()
          .single();

        if (insertError) throw insertError;
        return {
          showIslamic: newPrefs.show_islamic,
          showSpiritual: newPrefs.show_spiritual,
          showPsychological: newPrefs.show_psychological,
          theme: newPrefs.theme,
          language: newPrefs.language
        };
      }

      return {
        showIslamic: data.show_islamic,
        showSpiritual: data.show_spiritual,
        showPsychological: data.show_psychological,
        theme: data.theme,
        language: data.language
      };
    },
    enabled: !!user,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      if (!user) throw new Error('User not authenticated');

      const updateData = {
        show_islamic: newPreferences.showIslamic,
        show_spiritual: newPreferences.showSpiritual,
        show_psychological: newPreferences.showPsychological,
        theme: newPreferences.theme,
        language: newPreferences.language,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
      );

      const { error } = await supabase
        .from('user_preferences')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;
      return newPreferences;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
    },
  });

  return {
    preferences: preferences || {
      showIslamic: true,
      showSpiritual: true,
      showPsychological: true,
      theme: 'dark',
      language: 'en'
    },
    isLoading,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
};
