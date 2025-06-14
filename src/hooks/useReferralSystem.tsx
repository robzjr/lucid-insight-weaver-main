import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Database } from '@/types/database.types';

type UserUsage = Database['public']['Tables']['user_usage']['Row'];

export const useReferralSystem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for user credits, referral stats, and referrer info
  const { data: userStats, isLoading } = useQuery({
    queryKey: ['user-referrals', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get user usage stats
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select('paid_interpretations_remaining, referral_count')
        .eq('user_id', user.id)
        .single();

      if (usageError) throw usageError;

      // Get referrer info if this is a referred user
      const { data: referralData } = await supabase
        .from('referrals')
        .select('referrer_id')
        .eq('referred_id', user.id)
        .single();

      let referrerName = null;
      if (referralData?.referrer_id) {
        const { data: referrerProfile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', referralData.referrer_id)
          .single();
        
        referrerName = referrerProfile?.display_name;
      }

      return {
        ...usageData,
        referrerName
      };
    },
    enabled: !!user,
  });

  // Check for referral code in URL when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode && user) {
      processReferral(referralCode);
    }
  }, [user]);

  const processReferralMutation = useMutation({
    mutationFn: async (referralCode: string) => {
      if (!user) throw new Error('User not authenticated');

      // Call edge function to process referral
      const { data, error } = await supabase.functions.invoke('process-referral', {
        body: { referralCode, newUserId: user.id }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Referral bonus applied! You received 5 free interpretations!');
      queryClient.invalidateQueries({ queryKey: ['user-referrals'] });
    },
    onError: (error: any) => {
      console.error('Referral processing failed:', error);
      toast.error('Failed to process referral. Please try again.');
    },
  });

  const processReferral = (referralCode: string) => {
    processReferralMutation.mutate(referralCode);
  };

  const generateReferralLink = () => {
    if (!user) return '';
    const baseUrl = window.location.origin;
    const referralCode = user.id.slice(0, 8); // Use first 8 chars of user ID as referral code
    return `${baseUrl}?ref=${referralCode}`;
  };

  return {
    referralCount: userStats?.referral_count ?? 0,
    interpretationsRemaining: userStats?.paid_interpretations_remaining ?? 0,
    referrerName: userStats?.referrerName,
    generateReferralLink,
    processReferral,
    isLoading,
  };
};
