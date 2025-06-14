import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserUsage } from '@/hooks/useUserUsage';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

export interface Dream {
  id: string;
  dreamText: string;
  createdAt: string;
  interpretations?: {
    islamic: string;
    spiritual: string;
    psychological: string;
  };
}

export const useDreams = () => {
  const { user } = useAuth();
  const { canInterpret, incrementUsage } = useUserUsage();
  const { profile } = useUserProfile();
  const queryClient = useQueryClient();

  const { data: dreams = [], isLoading } = useQuery({
    queryKey: ['dreams', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: dreamsData, error: dreamsError } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dreamsError) throw dreamsError;

      const dreamsWithInterpretations = await Promise.all(
        dreamsData.map(async (dream) => {
          const { data: interpretations } = await supabase
            .from('interpretations')
            .select('*')
            .eq('dream_id', dream.id);

          const interpretationMap = interpretations?.reduce((acc, interp) => {
            acc[interp.type] = interp.content;
            return acc;
          }, {} as Record<string, string>) || {};

          return {
            id: dream.id,
            dreamText: dream.dream_text,
            createdAt: new Date(dream.created_at).toLocaleDateString(),
            interpretations: interpretationMap.islamic || interpretationMap.spiritual || interpretationMap.psychological
              ? {
                  islamic: interpretationMap.islamic || '',
                  spiritual: interpretationMap.spiritual || '',
                  psychological: interpretationMap.psychological || ''
                }
              : undefined
          };
        })
      );

      return dreamsWithInterpretations;
    },
    enabled: !!user,
  });

  const updateDreamMutation = useMutation({
    mutationFn: async ({ dreamId, newText }: { dreamId: string; newText: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('dreams')
        .update({ dream_text: newText, updated_at: new Date().toISOString() })
        .eq('id', dreamId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreams'] });
      toast.success('Dream updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating dream:', error);
      toast.error('Failed to update dream');
    },
  });

  const saveDreamMutation = useMutation({
    mutationFn: async ({ dreamText, interpretations }: { 
      dreamText: string; 
      interpretations: { islamic: string; spiritual: string; psychological: string } 
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: dreamData, error: dreamError } = await supabase
        .from('dreams')
        .insert({
          user_id: user.id,
          dream_text: dreamText,
        })
        .select()
        .single();

      if (dreamError) throw dreamError;

      const interpretationInserts = Object.entries(interpretations).map(([type, content]) => ({
        dream_id: dreamData.id,
        type,
        content,
      }));

      const { error: interpretationsError } = await supabase
        .from('interpretations')
        .insert(interpretationInserts);

      if (interpretationsError) throw interpretationsError;

      return dreamData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreams'] });
      toast.success('Dream saved to your journal!');
    },
    onError: (error) => {
      console.error('Error saving dream:', error);
      toast.error('Failed to save dream');
    },
  });

  const deleteDreamMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      if (!user) throw new Error('User not authenticated');

      // First delete interpretations
      const { error: interpretationsError } = await supabase
        .from('interpretations')
        .delete()
        .eq('dream_id', dreamId);

      if (interpretationsError) throw interpretationsError;

      // Then delete the dream
      const { error: dreamError } = await supabase
        .from('dreams')
        .delete()
        .eq('id', dreamId)
        .eq('user_id', user.id);

      if (dreamError) throw dreamError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreams'] });
      toast.success('Dream deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting dream:', error);
      toast.error('Failed to delete dream');
    },
  });

  const interpretDreamMutation = useMutation({
    mutationFn: async (dreamText: string) => {
      // Check if user can interpret before proceeding
      if (!canInterpret) {
        throw new Error('PAYMENT_REQUIRED');
      }

      console.log('Starting dream interpretation...');
      
      // Store the dream text in database immediately when interpretation starts
      const { data: dreamData, error: dreamError } = await supabase
        .from('dreams')
        .insert({
          user_id: user!.id,
          dream_text: dreamText,
        })
        .select()
        .single();

      if (dreamError) {
        console.error('Error storing dream:', dreamError);
        throw new Error('Failed to store dream');
      }

      // Prepare user context for personalized interpretation
      const userContext = {
        age: profile?.age || null,
        gender: profile?.gender || null,
        relationshipStatus: profile?.relationship_status || null,
        preferredStyle: profile?.preferred_style || null,
        displayName: profile?.display_name || null
      };

      const { data, error } = await supabase.functions.invoke('interpret-dream', {
        body: { 
          dreamText,
          userContext 
        }
      });

      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`API Error: ${error.message || 'Unknown error occurred'}`);
      }
      
      if (!data?.interpretations) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response from dream interpretation service');
      }

      // Save interpretations to the dream we just created
      const interpretationInserts = Object.entries(data.interpretations).map(([type, content]) => ({
        dream_id: dreamData.id,
        type,
        content: content as string,
      }));

      const { error: interpretationsError } = await supabase
        .from('interpretations')
        .insert(interpretationInserts);

      if (interpretationsError) {
        console.error('Error saving interpretations:', interpretationsError);
        throw new Error('Failed to save interpretations');
      }

      // Increment usage after successful interpretation
      incrementUsage();

      // Invalidate dreams query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['dreams'] });

      return data.interpretations;
    },
    onError: (error) => {
      console.error('Error interpreting dream:', error);
      
      if (error.message === 'PAYMENT_REQUIRED') {
        // Don't show toast here, let the component handle it
        return;
      } else if (error.message.includes('Google AI API key not configured')) {
        toast.error('Google AI API key is not configured. Please contact support.');
      } else if (error.message.includes('API Error')) {
        toast.error(`Analysis failed: ${error.message}`);
      } else {
        toast.error('Failed to analyze dream. Please try again.');
      }
    },
  });

  return {
    dreams,
    isLoading,
    saveDream: saveDreamMutation.mutate,
    updateDream: (dreamId: string, newText: string) => updateDreamMutation.mutate({ dreamId, newText }),
    deleteDream: deleteDreamMutation.mutate,
    interpretDream: interpretDreamMutation.mutate,
    isInterpreting: interpretDreamMutation.isPending,
    isSaving: saveDreamMutation.isPending,
    isUpdating: updateDreamMutation.isPending,
    isDeleting: deleteDreamMutation.isPending,
    interpretationResult: interpretDreamMutation.data,
    interpretationError: interpretDreamMutation.error,
  };
};
