
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface UserUsage {
  id: string;
  userId: string;
  freeInterpretationsUsed: number;
  paidInterpretationsRemaining: number;
  lastPaymentDate?: string;
}

export const useUserUsage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: usage, isLoading } = useQuery({
    queryKey: ['user-usage', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If no usage record exists, create one
      if (!data) {
        const { data: newUsage, error: insertError } = await supabase
          .from('user_usage')
          .insert({
            user_id: user.id,
            free_interpretations_used: 0,
            paid_interpretations_remaining: 0
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newUsage;
      }

      return data;
    },
    enabled: !!user,
  });

  const incrementUsageMutation = useMutation({
    mutationFn: async () => {
      if (!user || !usage) throw new Error('No user or usage data');

      const updates: any = {};
      
      if (usage.paid_interpretations_remaining > 0) {
        updates.paid_interpretations_remaining = usage.paid_interpretations_remaining - 1;
      } else {
        updates.free_interpretations_used = usage.free_interpretations_used + 1;
      }

      const { error } = await supabase
        .from('user_usage')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-usage'] });
    },
    onError: (error) => {
      console.error('Error updating usage:', error);
      toast.error('Failed to update usage');
    },
  });

  const canInterpret = usage ? 
    usage.free_interpretations_used < 5 || usage.paid_interpretations_remaining > 0 : 
    true;

  const interpretationsLeft = usage ? 
    Math.max(0, 5 - usage.free_interpretations_used) + usage.paid_interpretations_remaining :
    5;

  return {
    usage,
    isLoading,
    canInterpret,
    interpretationsLeft,
    incrementUsage: incrementUsageMutation.mutate,
    isUpdating: incrementUsageMutation.isPending,
  };
};
